require 'spec_helper'

describe Command do
  fixtures :cmd_defs
  it "command can be succeed in its life cycle" do
    cmd = Command.create :cmd_def_id => 1, :cmd_set_id => 1, :next_when_fail => false
    cmd.state.should == 'ready'
    cmd.invoke
    cmd.state.should == 'running'
    cmd.success
    cmd.state.should == 'done'
  end

  it "command may fail" do
    cmd = Command.create :cmd_def_id => 1, :cmd_set_id => 1, :next_when_fail => false
    cmd.state.should == 'ready'
    cmd.invoke
    cmd.state.should == 'running'
    cmd.failure
    cmd.state.should == 'fail'
    cmd.ack
    cmd.state.should == 'done'
  end
end
