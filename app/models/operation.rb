class Operation < ActiveRecord::Base
  belongs_to :machine
  belongs_to :command
  
  default_scope order("id")
  
  INIT = 0
  DOWNLOADED = 1
  RUNNING = 2
  COMPLETED = 3

  scope :inits, where(:status => INIT)
  scope :downloads, where(:status => DOWNLOADED)
  scope :runnings, where(:status => RUNNING)
  scope :completes, where(:status => COMPLETED)
  scope :uncompletes, where('status <> ?',COMPLETED)
  
  def download
    update_attribute :status, DOWNLOADED
  end

  def run
    update_attribute :status, RUNNING
  end

  def complete( isok, body)
    update_attributes :status => COMPLETED, :isok => isok, :response => body
  end
end
