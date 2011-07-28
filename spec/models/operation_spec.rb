require 'spec_helper'

describe Operation do

  it "operation can be succeed in its life cycle" do
    o = Operation.create :command_id => 1, :machine_host => 'localhost'
    o.state.should == 'init'
    o.download
    o.state.should == 'ready'
    o.invoke
    o.state.should == 'running'
    o.callback(true, "hello")
    o.state.should == 'done'
  end

  it "operation maybe fail in its life cycle" do
    o = Operation.create :command_id => 1, :machine_host => 'localhost'
    o.state.should == 'init'
    o.download
    o.state.should == 'ready'
    o.invoke
    o.state.should == 'running'
    o.callback(false, "hello")
    o.state.should == 'failure'
    o.ack
    o.state.should == 'done'
  end
end
