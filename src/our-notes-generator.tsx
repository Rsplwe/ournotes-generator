import { Label } from "./components/ui/label";
import { Button } from "./components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Palette, Type } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react";
import Layer1 from "@/assets/layer_1.svg";
import Layer2 from "@/assets/layer_2.svg";
import Layer3 from "@/assets/layer_3.svg";
import Layer4 from "@/assets/layer_4.svg";

type Layer = {
  x: number
  y: number
  width: number
  height: number
  gradient: {
    x: number
    from: string
    to: string
  }
}

function loadSvg(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

function drawGradientSvg(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  item: Layer
) {
  const offscreen = document.createElement("canvas")
  offscreen.width = item.width
  offscreen.height = item.height

  const octx = offscreen.getContext("2d")!
  octx.drawImage(img, 0, 0, item.width, item.height)
  const gradient = ctx.createLinearGradient(item.gradient.x, 0, item.width, 0)
  gradient.addColorStop(0, item.gradient.from)
  gradient.addColorStop(1, item.gradient.to)

  octx.globalCompositeOperation = "source-in"
  octx.fillStyle = gradient
  octx.fillRect(0, 0, item.width, item.height)
  ctx.drawImage(offscreen, item.x + 60, item.y + 50)
}

type StaffLineOptions = {
  x: number
  y: number
  width: number
  lines?: number
  lineGap?: number
  strokeWidth?: number
  angle?: number
  color?: string
}

function drawStaffLines(
  ctx: CanvasRenderingContext2D,
  {
    x,
    y,
    width,
    lines = 5,
    lineGap = 10,
    strokeWidth = 2,
    angle = 0,
    color = "#ffffff",
  }: StaffLineOptions
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)

  ctx.strokeStyle = color
  ctx.lineWidth = strokeWidth
  ctx.lineCap = "round"

  for (let i = 0; i < lines; i++) {
    const offsetY = i * lineGap
    ctx.beginPath()
    ctx.moveTo(0, offsetY)
    ctx.lineTo(width, offsetY)
    ctx.stroke()
  }

  ctx.restore()
}

interface Settings {
  primaryColor1: string
  primaryColor2: string
  secondaryColor1: string
  secondaryColor2: string
  gradientLeftOffset1: number,
  gradientLeftOffset2: number,
  text1: string
  text2: string
  text3: string
}

const defaultSettings: Settings = {
  primaryColor1: "#1b223d",
  primaryColor2: "#98708d",
  secondaryColor1: "#314b88",
  secondaryColor2: "#6ca8c1",
  gradientLeftOffset1: 400,
  gradientLeftOffset2: 100,
  text1: "BanG Dream!",
  text2: "Our Notes",
  text3: "アワノツ",
}

function drawRotatedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  style: string,
  font: string,
  x: number,
  y: number,
  degrees: number,
  spacing: number
) {
  ctx.save();
  ctx.fillStyle = style;
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.letterSpacing = spacing + 'px';
  ctx.font = font;
  ctx.translate(x, y);
  ctx.rotate(degrees * Math.PI / 180);
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

export default function OurNotesGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleExport = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = "our-notes-generator.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const draw = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.clearRect(0, 0, width, height)
    const layer1 = await loadSvg(Layer1)
    const layer2 = await loadSvg(Layer2)
    const layer3 = await loadSvg(Layer3)
    const layer4 = await loadSvg(Layer4)
    drawGradientSvg(ctx, layer1, {
      x: 0,
      y: 0,
      width: 1199,
      height: 798,
      gradient: {
        x: settings.gradientLeftOffset1,
        from: settings.primaryColor1,
        to: settings.primaryColor2,
      },
    })
    if (settings.text3) {
      drawGradientSvg(ctx, layer2, {
        x: 646,
        y: 351,
        width: 554,
        height: 270,
        gradient: {
          x: settings.gradientLeftOffset2,
          from: settings.secondaryColor1,
          to: settings.secondaryColor2,
        },
      })
    }
    drawGradientSvg(ctx, layer3, {
      x: 35,
      y: -14,
      width: 1062,
      height: 616,
      gradient: {
        x: settings.gradientLeftOffset1,
        from: settings.primaryColor1,
        to: settings.primaryColor2,
      },
    })
    drawGradientSvg(ctx, layer4, {
      x: 35,
      y: 45,
      width: 696,
      height: 285,
      gradient: {
        x: settings.gradientLeftOffset2,
        from: settings.secondaryColor1,
        to: settings.secondaryColor2,
      },
    })
    const offscreen = document.createElement("canvas")
    offscreen.width = width
    offscreen.height = height
    const octx = offscreen.getContext("2d")!
    drawStaffLines(octx, {
      x: 40,
      y: 536,
      width: 1300,
      lines: 5,
      lineGap: 54,
      strokeWidth: 2.5,
      angle: -0.32,
    })
    octx.globalCompositeOperation = "destination-in"
    octx.drawImage(canvas, 0, 0)
    octx.globalCompositeOperation = "source-over"
    ctx.drawImage(offscreen, 0, 0)

    drawRotatedText(ctx, settings.text1, "white", "67px sans-serif", 485, 235, -18.3, 10);
    drawRotatedText(ctx, settings.text2, "white", "210px sans-serif", 660, 445, -18.3, 2);
    //drawRotatedText(ctx, settings.text2, "white", "120px sans-serif", 700, 420, -18);
    drawRotatedText(ctx, settings.text3, "white", "67px sans-serif", 930, 550, -18, 2);
  }, [settings])

  useEffect(() => {
    draw()
  }, [draw])

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4 md:px-8">
          <h1 className="text-xl text-foreground">OurNotes</h1>
        </div>
      </nav>
      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6">
            <Card className="order-1 bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-card-foreground">预览</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center rounded-lg bg-secondary/50 p-4">
                  <canvas
                    ref={canvasRef}
                    width={1300}
                    height={900}
                    className="w-full max-w-150 rounded-lg shadow-2xl"
                    style={{ aspectRatio: "3/2" }}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="order-2 space-y-4">
              <Card className="bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base text-card-foreground">
                    <HugeiconsIcon icon={Palette} />
                    颜色
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-card-foreground">背景颜色渐变</Label>
                    <div className="flex gap-3">
                      <div className="flex-1 space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Start</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={settings.primaryColor1}
                            onChange={(e) => updateSetting("primaryColor1", e.target.value)}
                            className="h-10 w-14 cursor-pointer rounded border border-border bg-transparent"
                          />
                          <Input
                            value={settings.primaryColor1}
                            onChange={(e) => updateSetting("primaryColor1", e.target.value)}
                            className="h-10 flex-1 font-mono text-xs"
                          />
                        </div>
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <Label className="text-xs text-muted-foreground">End</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={settings.primaryColor2}
                            onChange={(e) => updateSetting("primaryColor2", e.target.value)}
                            className="h-10 w-14 cursor-pointer rounded border border-border bg-transparent"
                          />
                          <Input
                            value={settings.primaryColor2}
                            onChange={(e) => updateSetting("primaryColor2", e.target.value)}
                            className="h-10 flex-1 font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-card-foreground">主要颜色渐变</Label>
                    <div className="flex gap-3">
                      <div className="flex-1 space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Start</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={settings.secondaryColor1}
                            onChange={(e) => updateSetting("secondaryColor1", e.target.value)}
                            className="h-10 w-14 cursor-pointer rounded border border-border bg-transparent"
                          />
                          <Input
                            value={settings.secondaryColor1}
                            onChange={(e) => updateSetting("secondaryColor1", e.target.value)}
                            className="h-10 flex-1 font-mono text-xs"
                          />
                        </div>
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <Label className="text-xs text-muted-foreground">End</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={settings.secondaryColor2}
                            onChange={(e) => updateSetting("secondaryColor2", e.target.value)}
                            className="h-10 w-14 cursor-pointer rounded border border-border bg-transparent"
                          />
                          <Input
                            value={settings.secondaryColor2}
                            onChange={(e) => updateSetting("secondaryColor2", e.target.value)}
                            className="h-10 flex-1 font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base text-card-foreground">
                    <HugeiconsIcon icon={Type} />
                    文本
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">文本 1</Label>
                    <Input
                      value={settings.text1}
                      onChange={(e) => updateSetting("text1", e.target.value)}
                      placeholder="BanG Dream!"
                      className="bg-input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">文本 2</Label>
                    <Input
                      value={settings.text2}
                      onChange={(e) => updateSetting("text2", e.target.value)}
                      placeholder="Our Notes"
                      className="bg-input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">文本 3</Label>
                    <Input
                      value={settings.text3}
                      onChange={(e) => updateSetting("text3", e.target.value)}
                      placeholder="アワーノーツ"
                      className="bg-input"
                    />
                  </div>
                </CardContent>
              </Card>
              <Button
                onClick={handleExport}
                className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
              >
                <HugeiconsIcon icon={Download} />
                导出图片
              </Button>
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full">
        <div className="flex h-12 items-center justify-center px-4 text-sm text-muted-foreground">
          <a href="https://github.com/Rsplwe/ournotes-generator">Source Code</a>
        </div>
      </footer>
    </div>
  )
}