require 'spec_helper'

describe "apps/index.html.erb" do
  before(:each) do
    assign(:apps, [
      stub_model(App),
      stub_model(App)
    ])
  end

  it "renders a list of apps" do
    render
  end
end
