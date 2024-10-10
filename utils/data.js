import PogObject from '../../PogData/index'

export const data = new PogObject("CatgirlYharimAddons", {
    stormTickTimer: {
        x: Renderer.screen.getWidth() / 2,
        y: Renderer.screen.getHeight() / 2,
        scale: 1
    },
    melodyWarning: {
        x: Renderer.screen.getWidth() / 2,
        y: Renderer.screen.getHeight() / 2,
        scale: 1,
        enabled: true
    },
    tickShift: {
        x: Renderer.screen.getWidth() / 2,
        y: Renderer.screen.getHeight() / 2,
        scale: 1,
    },
    dragPrio: {
        x: Renderer.screen.getWidth() / 2,
        y: Renderer.screen.getHeight() / 2,
        scale: 1,
    }
}, "data/posData.json")

export const autoP3Data = new PogObject('CatgirlYharimAddons', {
    rings: []
}, "data/rings.json")


export default data