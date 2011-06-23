require 'ftools'
require 'fileutils'

rails_root=File.expand_path __FILE__+"/../../../.."
asset=File.expand_path __FILE__+'/../install_assets'

FileUtils.mkdir_p rails_root+"/java/conf" unless File.exist? rails_root+"/java/conf"
FileUtils.mkdir_p rails_root+"/java/jars" unless File.exist? rails_root+"/java/jars"
FileUtils.mkdir_p rails_root+"/java/src/test/java" unless File.exist? rails_root+"/java/src/test/java"
FileUtils.mkdir_p rails_root+"/java/src/main/java" unless File.exist? rails_root+"/java/src/main/java"

%w{development test production}.each{|env|
  dest_file = "#{rails_root}/java/conf/springbeans_#{env}.xml"
  File.copy(asset+'/springbeans.xml', dest_file,true) unless File.exist? dest_file
}

File.copy(asset+'/pom.xml', rails_root+'/java') unless File.exist? rails_root+'/java/pom.xml'

puts "Files installed."
`bundle exec rake java_side:jars`
puts "Task java_side:jars invoked"
