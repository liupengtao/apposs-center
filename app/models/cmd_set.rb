class CmdSet < ActiveRecord::Base
  belongs_to :cmd_set_def
  
  has_many :commands

  belongs_to :operator, :class_name => 'User'
  
  belongs_to :app

  state_machine :state, :initial => :init do
    event :fire do transition :init => :running end
    event :failure do transition :running => :fail end
    event :acknowledge do transition :fail => :done end
    event :ack do transition :fail => :done end
    event :success do transition :running => :done end
  end
end
