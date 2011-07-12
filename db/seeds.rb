# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Daley', :city => cities.first)

profile = Profile.create :name => 'jboss'

profile.command_defs << CommandDef.create(:name => 'echo start')
profile.command_defs << CommandDef.create(:name => 'echo stop')
profile.command_defs << CommandDef.create(:name => 'echo redeploy')

app = App.create(:name => 'sample-app', :profile => profile)
app.machines << Machine.create(:name => 'tanx1.cnz',:host => 'localhost')
app.machines << Machine.create(:name => 'tanx2.cnz',:host => 'test')
Machine.create(:name => 'tanx3.cnz',:host => 'test')

admin_role = Role.create(:name => 'Admin')
pe_role = Role.create(:name => 'PE')
appops_role = Role.create(:name => 'AppOPS')
u = User.create(:email => 'li.jianye@gmail.com', :password => 'hahaha')
Stakeholder.create :user => u, :app => app, :role => pe_role

%w{cnz cm3 cm4}.each{|name| Room.create(:name => name)}

Room.first.machines << Machine.all

