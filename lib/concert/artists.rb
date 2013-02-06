class Concert
  class Artists
    attr_accessor :headliner, :artists
    
    def initialize(params)
      @artists=params["artist"]
      @headliner=params["headliner"]
    end
    
  end
end