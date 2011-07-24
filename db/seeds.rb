# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
# cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
# Mayor.create(:name => 'Daley', :city => cities.first)

cmd_group = CmdGroup.create :name => 'jboss'

cmd_group2 = CmdGroup.create :name => 'nodejs'

cmd_group.cmd_defs << CmdDef.create(:name => 'echo start')
cmd_group.cmd_defs << CmdDef.create(:name => 'echo stop')
cmd_group.cmd_defs << CmdDef.create(:name => 'echo redeploy')

cmd_group2.cmd_defs << CmdDef.create( :name => 'echo start_nodejs')
cmd_group2.cmd_defs << CmdDef.create( :name => 'echo stop_nodejs')

app = App.create(:name => 'sample-app')
app.machines << Machine.create(:name => 'tanx1.cnz',:host => 'localhost')
app.machines << Machine.create(:name => 'tanx2.cnz',:host => 'test')
Machine.create(:name => 'tanx3.cnz',:host => 'test')

app.cmd_set_defs << CmdSetDef.create(:name => "upgrade package", :expression => '1,2|true,4')


admin_role = Role.create(:name => 'Admin')
pe_role = Role.create(:name => 'PE')
appops_role = Role.create(:name => 'AppOPS')
u = User.create(:email => 'li.jianye@gmail.com', :password => 'hahaha')
Stakeholder.create :user => u, :app => app, :role => pe_role

%w{cnz cm3 cm4}.each{|name| Room.create(:name => name)}

Room.first.machines << Machine.all
