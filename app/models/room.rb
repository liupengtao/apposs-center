class Room < ActiveRecord::Base
  has_many :machines
  
  def to_s
  	send :name
  end
end
