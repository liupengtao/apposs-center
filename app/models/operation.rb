class Operation < ActiveRecord::Base
  belongs_to :machine
  belongs_to :command
  
  default_scope order("id")
  
  INIT = 0
  DOWNLOADED = 1
  RUNNING = 2
  COMPLETED = 3

  scope :downloaded, where(:status => DOWNLOADED)
  scope :running, where(:status => RUNNING)
  scope :completed, where(:status => COMPLETED)
  scope :uncompleted, where('status <> ?',COMPLETED)
  
  def download
    update_attribute :status, DOWNLOADED
  end

  def run
    update_attribute :status, RUNNING
  end

  def done
    update_attribute :status, COMPLETED
  end
end
