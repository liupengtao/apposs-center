require 'spec_helper'

describe "apps/show.html.erb" do
  before(:each) do
    @app = assign(:app, stub_model(App))
  end

  it "renders attributes in <p>" do
    render
  end
end
