class HomeController < ApplicationController
  before_filter :ajax_mobile
  
=begin  caches_action :search,
    :cache_path => Proc.new { |c| c.params.delete_if { |k,v| k.starts_with?('utm_') } },
=end    :expires_in => 4.hours
  
  def index
  end
  
  def about
    @comment = Comment.new
  end
  
  def comment
    @comment = Comment.new params[:comment]
    
    if @comment.save  
      redirect_to about_path
    else
      render action: 'about'
    end
  end
  
  def contact
    @message = Message.new
  end
  
  def mail
    @message = Message.new(params[:message])
    
    respond_to do |format|
      if @message.valid?
        begin
          mail = ContactMailer.contact_email(@message)
          mail.deliver
          format.html { redirect_to '/contact', notice: 'Mail sent' }
        rescue
          format.html { redirect_to '/contact', notice: 'We couldn\'t deliver the message. Please, try again later.' }
        end
      else
        format.html { render action: "contact" }
      end
    end
  end
  
  def search
    begin
      request.xhr? && flash.clear
      @lastfm=Lastfm.new AKEY["api_key"], AKEY["api_secret"]
      @events = @lastfm.send(params[:search_by]).get_events(params[:term],params[:radius])
      if @events.nil?
        flash[:error]='We couldn\'t find any event'
      else
        @sorted = sort_by_venue(@events.group_by {|i| i["venue"]["name"]})
        from = DateTime.new(params[:date]["from(1i)"].to_i,params[:date]["from(2i)"].to_i,params[:date]["from(3i)"].to_i)
        to = DateTime.new(params[:date]["to(1i)"].to_i,params[:date]["to(2i)"].to_i,params[:date]["to(3i)"].to_i)
        @not_located, @filtered_date = filter_not_located(filter_by_date(@sorted, from, to))
        if ((@filtered_date.size == 0) and (@not_located.size == 0))
          @filtered_date = nil
          raise Lastfm::ApiError.new("We couldn't find any event.")
        end
      end
    rescue Lastfm::ApiError => e
      flash[:error]=e.message
    rescue Exception => e
      #flash[:error]="This is taking a while... please, try again later or be more specific in your request"
      flash[:error]="#{e.class} + #{e.message}"
    ensure
      respond_to do |format|
        format.html {render "index"}
        format.js   {render "search"}
        format.mobile {render "index.mobile"}
        format.mobile_ajax {render "search"}
        format.json {render :json => @filtered_date.to_json.html_safe}
      end
    end
  end
  
  def ie
    respond_to do |format|
      format.html {render :layout => false}
    end
  end
  
private

  def sort_by_venue(concerts_hash)
    aux = {}
    concerts_hash.each do |venue, concerts_array|
      aux[venue]=Array.new
      concerts_array.each do |concert|
        aux[venue] << Concert.new(concert)
      end
    end
    return aux
  end
  
  def filter_by_date(concerts_hash,date_from,date_to)
    aux = {}
    concerts_hash.each do |venue, concerts_array|
      concerts_array.each do |concert|
        if ((concert.date >= date_from) and (concert.date <= (date_to+1)))
          (aux[venue]==nil) and (aux[venue]=Array.new)
          aux[venue]<<concert
        end 
      end
    end
    return aux 
  end
  
  def filter_not_located(concerts_hash)
    aux = {}
    aux2 = {}
    concerts_hash.each do |venue, concerts_array|
      concerts_array.each do |concert|
        if ((concert.venue.location["point"]["lat"].blank?) or (concert.venue.location["point"]["lat"].blank?))
          (aux[venue]==nil) and (aux[venue]=Array.new)
          aux[venue]<<concert
        else
          (aux2[venue]==nil) and (aux2[venue]=Array.new)
          aux2[venue]<<concert
        end 
      end
    end
    return aux, aux2
  end

  def ajax_mobile
    is_mobile_request? and request.xhr? and (request.format = :mobile_ajax)
  end
end
