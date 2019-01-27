import pygame, sys
from pytmx import load_pygame

pygame.init()
size = width, height = 800, 600

screen = pygame.display.set_mode(size)

tilesize = 32

class Mouse:
    def __init__(self):
        self.x = 0
        self.y = 0
        self.climbing = False
        self.touchingGround = True

class Level:
    def __init__(self, path):
        self.tmxdata = load_pygame(path)

    def draw(self, camera, screen):
        for i in range(100):
            for j in range(100):      
                position = (camera.x+i*tilesize, camera.y+j*tilesize)
                image = self.tmxdata.get_tile_image(
                    camera.x//tilesize+i, 
                    camera.y//tilesize+j,
                    0
                )
                screen.blit(image, position)


class Camera:
    def __init__(self, mouse):
        self.mouse = mouse
        self.x = mouse.x
        self.y = mouse.y
        self.widthtiles = 20
        self.heighttiles= 20

currentlevel = Level("testlevel.tmx")
mouse = Mouse()
camera = Camera(mouse)

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            sys.exit()

    currentlevel.draw(camera, screen)
    screen.flip()
    pygame.display.update()
    pygame.time.delay(1000/60)

    

    