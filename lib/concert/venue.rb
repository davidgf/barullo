class Concert
  class Venue
    attr_accessor :id, :name, :location, :url, :website, :image
    
    # Constructs a venue object from a hash.
    #
    # Hash of params:
    # * :id - id of the venue in lastfm.
    # * :name - name of the venue.
    # * :location - hash with the location details:
    #   * :city 
    #   * :country
    #   * :street
    #   * :postalcode
    #   * :point - hash with latitude and longitude.
    # * :url - url of the venue site in lastfm.
    # * :website - site of the venue.
    # * :image - hash with image urls
    def initialize(params)
      @id=params["id"]
      @name=params["name"]
      @location=params["location"]
      @url=params["url"]
      @website=params["website"]
      @image=params["image"]
    end
    
  end
end