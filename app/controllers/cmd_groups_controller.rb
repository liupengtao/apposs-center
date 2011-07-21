class CmdGroupsController < ApplicationController
  def index
    render :text => CmdGroup.all.to_json(:include => [:cmd_defs])
  end
end
