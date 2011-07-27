class Operation < ActiveRecord::Base
  belongs_to :machine
  belongs_to :command
  
  default_scope order("id")

  scope :inits, where(:state => :init)

  def callback( isok, body)
    self.isok = isok
    self.response = body
    deal
  end

  state_machine :state, :initial => :init do
    event :download do transition :init => :ready end
    event :invoke do transition :ready => :running end
    event :deal do
      transition :running => :done if :is_ok?
      transition :running => :failure unless :is_ok?
    end
    event :ack do transition :failure => :done end
  end

  def is_ok?
    self.isok
  end
end
