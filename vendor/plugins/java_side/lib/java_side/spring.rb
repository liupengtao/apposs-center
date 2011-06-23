require "active_record"
require "action_view"

# usage:
#   get_bean 
module JavaSide
  module Spring

    def get_bean name
      VALUE.get_bean name
    end

    private
      class Container

        attr_accessor :container

        def initialize
          init!
        end


        def get_bean name
          self.container.getBean(name)
        end

        def destroy
          self.container.destroy if self.container
          self
        end

        def init!
          file = "springbeans_#{Rails.env}.xml"
          p "load #{file}"
          begin
            self.container = org.springframework.context.support.ClassPathXmlApplicationContext.new(file)
          rescue NameError => error
            puts "[1m[33mCannot load spring framework[0m.\nPlease check [1m[35mpom.xml[0m and add springframework's library, then re-run: [1m[35mrake java_side:jars[0m \n[Root Cause: #{error.message}]"
          rescue Exception => e
            puts "unknown error: #{e.message}"
          end
          self
        end
      end

    VALUE = Container.new
  end
end

ActiveRecord::Base.send :include, JavaSide::Spring
