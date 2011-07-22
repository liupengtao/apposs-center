class CmdSetDef < ActiveRecord::Base
  belongs_to :app
  has_many :cmd_sets

  # cmd set def定义了一个命令包，对于指定的一个cmd_set_id，可以为之创建命令包所对应的一组执行命令
  def build_commands cmd_set_id
    # 解析结构化字符串
    ids = expression.split(',').collect{|item|
      pair = item.squish.split('|')
      [pair[0].to_i, pair[1]=="true"]
    }
    #为循环缓存变量
    cmd_defs = CmdDef.
        where( :id => ids.collect{|pair| pair[0]} ).
        inject({}){|hash,cmd_def|
          hash.update(cmd_def.id=>cmd_def)
        }
    app_id = app.id
    # 循环创建 command 对象
    ids.collect{|pair|
      cmd_def_id, next_when_fail = pair
      cmd_def = cmd_defs[cmd_def_id]
      Command.create(
          :name => cmd_def.name,
          :cmd_def_id => cmd_def_id,
          :cmd_set_id => cmd_set_id
      )
    }
  end
end
