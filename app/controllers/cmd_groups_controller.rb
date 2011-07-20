class CmdGroupsController < ApplicationController
  def index
    respond_with current_app.cmd_groups
  end
end
