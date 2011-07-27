require 'spec_helper'

describe CmdSet do
  fixtures :cmd_groups,:cmd_defs,:users,:roles,:apps,:stakeholders,:cmd_set_defs,:rooms,:machines
  it "can be create by cmd set def" do
    cs = App.first.cmd_set_defs.first.create_cmd_set User.first
    cs.should_not be_nil
  end
  
end
