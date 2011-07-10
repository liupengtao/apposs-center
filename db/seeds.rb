# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Daley', :city => cities.first)

app = App.create(:name => 'sample-app')
app.machines << Machine.create(:name => 'tanx1.cnz')
admin_role = Role.create(:name => 'Admin')
pe_role = Role.create(:name => 'PE')
appops_role = Role.create(:name => 'AppOPS')
u = User.create(:email => 'li.jianye@gmail.com', :password => 'hahaha')
Stakeholder.create :user => u, :app => app, :role => pe_role

%w{cnz cm3 cm4}.each{|name| Room.create(:name => name)}
Machine.first.room = Room.first
