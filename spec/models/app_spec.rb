require 'spec_helper'

describe App do
  fixtures :users
  it "should has its operations" do
    App.all.each{|app|
      app.operations.should be_empty
    }
  end
end
