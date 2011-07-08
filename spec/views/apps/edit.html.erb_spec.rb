require 'spec_helper'

describe "apps/edit.html.erb" do
  before(:each) do
    @app = assign(:app, stub_model(App))
  end

  it "renders the edit app form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form", :action => apps_path(@app), :method => "post" do
    end
  end
end
