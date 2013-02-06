=begin
 Class that wraps a lastfm event 
=end

require 'concert/venue'
require 'concert/artists'
require 'lastfm'
class Concert
  attr_accessor :artists, :venue, :title, :date, :date_js, :url, :tags, :description, :tickets, :image, :website, :cancelled
  
  def initialize(params)
    @venue=Venue.new params["venue"]
    @artists=Artists.new params["artists"]
    @title=params["title"]
    @date=DateTime.parse params["startDate"]
    @date_js=@date.strftime("%d/%m/%Y, %H:%M")
    @url=params["url"]
    @tags=params["tags"]
    @cancelled=params["cancelled"]
    @website=params["website"]
    @image=params["image"]
    @description=params["description"]
    @tickets=params["tickets"]
  end
  
end