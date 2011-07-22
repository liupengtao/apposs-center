require 'mechanize'

a = Mechanize.new
a.get('http://localhost:3000/') do |page|
  page.form_with(:action => '/users/sign_in') do |form|
    form.fields[2].value = 'li.jianye@gmail.com'
    form.fields[3].value = 'hahaha'
  end.submit
end

%w{/apps /apps/1 /apps/1/cmd_set_defs /apps/1/cmd_set_defs/1}.each{|url|
  puts a.get(url).body
}

# 移动开发
