class CmdSetDef < ActiveRecord::Base
  belongs_to :app
  has_many :cmd_sets

  # cmd set def 定义了一个命令包，对于指定的一个cmd_set_id，可以为之创建命令包所对应的一组执行命令
  def create_cmd_set user
    cmd_set = CmdSet.create :cmd_set_def => self, :operator => user
    build_commands cmd_set.id
  end

  # 根据 cmd set id 生成 command 记录（同时会自动生成 operation 记录)
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
          :cmd_def_id => cmd_def_id,
          :cmd_set_id => cmd_set_id,
          :next_when_fail => next_when_fail
      )
    }
  end
end
