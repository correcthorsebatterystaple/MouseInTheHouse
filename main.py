import cocos
from cocos.tiles import load
from cocos.layer import ScrollingManager
from cocos.director import director
from cocos.scene import Scene

director.init()


map = cocos.tiles.load('testlevel.tmx')

view_manager = ScrollingManager()
view_manager.add(map['Tile Layer 1'])
view_manager.set_focus(20, 20)

main_scene = cocos.scene.Scene(view_manager)

director.run(main_scene)