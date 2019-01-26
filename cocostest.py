import cocos, random

class HelloWorld(cocos.layer.Layer):
    is_event_handler = True
    
    def __init__(self):
        super(HelloWorld, self).__init__()
        label = cocos.text.Label(
            'Hello world',
            font_name='Times new roman',
            font_size=60,
            anchor_x="center",anchor_y="center"
        )
        label.position = 320, 240+random.randint(0, 10)
        self.add(label)

cocos.director.director.init()
hello = HelloWorld()
main_scene = cocos.scene.Scene(hello)
cocos.director.director.run(main_scene)
