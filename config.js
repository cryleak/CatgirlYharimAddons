import DefaultConfig from "../Amaterasu/core/DefaultConfig"
import Settings from "../Amaterasu/core/Settings"

// Movable guis
export const stormTickTimerGui = new Gui()
export const melodyWarningGui = new Gui()
// export const tickShiftGui = new Gui()

const config = new DefaultConfig("CatgirlYharimAddons", "data/settings.json")


config
    .addSwitch({
        configName: "alwaysSprint",
        title: "Always Sprint",
        description: "Will make you always sprint.\nUnlike Bloom's, this one does not require your Sprint keybind to be bound.",
        category: "General",
    })
    .addSwitch({
        configName: "stormTickTimerEnabled",
        title: "Storm Tick Timer",
        description: "Tick timer for when the pad will pad, and also when storm will get crushed. Tick is every 1 second. The timer goes red 0.15s before the tick.",
        category: "Dungeons",
        subcategory: "Storm"
    })
    .addButton({
        configName: "moveStorkTickTimer",
        title: "Move Timer",
        description: "You can set exact positions in the posData.json file in CatgirlYharim's directory.",
        category: "Dungeons",
        subcategory: "Storm",
        title: "Move",
        onClick() {
            stormTickTimerGui.open()
        }
    })
    .addSwitch({
        configName: "relicTimerEnabled",
        title: "Relic Timer",
        description: "Tells you when the relic is going to spawn and how long it took to spawn, place and both.",
        category: "Wither King",
        subcategory: "Relic"
    })
    .addSwitch({
        configName: "relicLook",
        title: "Relic Look",
        description: "Rotates to the cauldron instantly after you click the orange/red relic.",
        category: "Wither King",
        subcategory: "Relic"
    })
    .addSwitch({
        configName: "relicTriggerbot",
        title: "Relic Triggerbot",
        description: "Triggerbot to place the relic automatically.",
        category: "Wither King",
        subcategory: "Relic"
    })
    .addSwitch({
        configName: "blinkRelics",
        title: "Blink Relics",
        description: "§4NOT INCLUDED IN THE PUBLIC VERSION OF CGY, DISABLE THIS IF YOU CAN'T USE IT\n§cRequires Relic Look and Relic Triggerbot to be enabled. Also requires a custom brush config, which you can ask me about.\nInstantly teleports you to the relic; requires 500 speed.",
        category: "Wither King",
        subcategory: "Relic"
    })
    .addSwitch({
        configName: "relicAura",
        title: "Relic Aura",
        description: "§4NOT INCLUDED IN THE PUBLIC VERSION OF CGY, DISABLE THIS IF YOU CAN'T USE IT\nHas higher range than Odin.",
        category: "Wither King",
        subcategory: "Relic"
    })
    .addSwitch({
        configName: "dragPrio",
        title: "Drag Prio",
        description: "Tells you what dragon to go to and has a timer.",
        category: "Wither King",
        subcategory: "Drag Prio"
    })
    .addSwitch({
        configName: "healerGoWithArch",
        title: "Go with Archer as Healer",
        description: "Tells you to go to the Archer's dragon on split if you are Healer.",
        category: "Wither King",
        subcategory: "Drag Prio"
    })
    .addSlider({
        configName: "minSplitPower",
        title: "Minimum Power",
        description: "Minumum power to split on.",
        category: "Wither King",
        subcategory: "Drag Prio",
        options: [5, 31]
    })
    .addSwitch({
        configName: "partyFinderNotification",
        title: "Party Finder Notification Sound",
        description: "Makes a sound when someone joins your party.",
        category: "Dungeons",
        subcategory: "Party Finder"
    })
    .addDropDown({
        configName: "partyFinderSound",
        title: "Party Finder Sound",
        description: "",
        category: "Dungeons",
        subcategory: "Party Finder",
        options: ["note.pling", "mob.blaze.hit", "fire.ignite", "random.orb", "mob.cat.meow"],
        value: 4
    })
    .addSlider({
        configName: "partyFinderPitch",
        title: "Party Finder Sound Pitch",
        description: "",
        category: "Dungeons",
        subcategory: "Party Finder",
        options: [0.5, 2],
        value: 1
    })
    .addKeybind({
        category: "Dungeons",
        description: "",
        configName: "stonkSwap",
        title: "Stonk Swap Keybind",
        subcategory: "Stonk Swap"
    })
    .addSwitch({
        configName: "stonkSwapDing",
        title: "Stonk Swap Ding Toggle",
        description: "Makes a sound when you successfully stonk swap.",
        category: "Dungeons",
        subcategory: "Stonk Swap"
    })
    .addDropDown({
        configName: "stonkSwapSound",
        title: "Stonk Swap Sound",
        description: "",
        category: "Dungeons",
        subcategory: "Stonk Swap",
        options: ["note.pling", "mob.blaze.hit", "fire.ignite", "random.orb", "mob.cat.meow"],
        value: 4
    })
    .addSlider({
        configName: "stonkSwapPitch",
        title: "Stonk Swap Sound Pitch",
        description: "",
        category: "Dungeons",
        subcategory: "Stonk Swap",
        options: [0.5, 2],
        value: 1
    })
    .addSwitch({
        category: "Terminals",
        configName: "autop3",
        title: "AutoP3",
        description: "Toggle AutoP3.",
        subcategory: "Auto P3"
    })
    .addSwitch({
        category: "Terminals",
        configName: "editMode",
        title: "Edit Mode",
        description: "Stops rings from moving you",
        subcategory: "Auto P3"
    })
    .addSwitch({
        category: "Terminals",
        configName: "autoSave",
        title: "Auto save",
        description: "Automatically saves rings.",
        subcategory: "Auto P3"
    })
    .addSwitch({
        category: "Terminals",
        configName: "silentLook",
        title: "SilentLook",
        description: "Causes you not to rotate clientside when you Bonzo Staff & Superboom.",
        subcategory: "Auto P3"
    })
    .addSwitch({
        category: "Terminals",
        configName: "activeOnce",
        title: "Activate rings once",
        description: "Causes every ring to activate only once. Resets when stepping out of the ring.",
        subcategory: "Auto P3"
    })
    .addTextInput({
        category: "Terminals",
        configName: "route",
        title: "Route",
        description: "Which route to load. Do /load to reload routes.",
        value: "",
        placeHolder: "",
        subcategory: "Auto P3"
    })
    .addSwitch({
        category: "Terminals",
        configName: "render",
        title: "Render as rings",
        description: "Render AutoP3 config as rings instead of boxes.",
        subcategory: "Auto P3"
    })
    .addSwitch({
        category: "Terminals",
        configName: "startOn",
        description: "Start on a chat message of your own choice",
        subcategory: "Auto P3",
        title: "Start on special message."
    })
    .addTextInput({
        category: "Terminals",
        configName: "startOnText",
        description: "Chat message to start autop3 on (You need to ct reload after.).",
        subcategory: "Auto P3",
        title: "Trigger message."
    })
    .addSwitch({
        category: "Terminals",
        configName: "routeP1On",
        description: "Automatically select a route on Boss start.",
        subcategory: "Auto P3",
        title: "Select Route on Boss start."
    })
    .addTextInput({
        category: "Terminals",
        configName: "routeP1",
        description: "Route to automatically select on Boss start.",
        subcategory: "Auto P3",
        title: "Route on Boss start."
    })
    .addSwitch({
        category: "Terminals",
        configName: "routeP3On",
        description: "Automatically select a route on P3 start.",
        subcategory: "Auto P3",
        title: "Select Route on P3 start."
    })
    .addTextInput({
        category: "Terminals",
        configName: "routeP3",
        description: "Route to automatically select on P3 start.",
        subcategory: "Auto P3",
        title: "Route on P3 start."
    })
    .addSwitch({
        configName: "terminalTimestamps",
        title: "Terminal Timestamps",
        description: "Adds a message for how far into the phase and terminals the terminal was completed",
        category: "Terminals",
        subcategory: "Terminal Timestamps"

    })
    .addSwitch({
        configName: "melodyWarningEnabled",
        title: "Toggle Melody Warning",
        description: "Warns you when someone has Melody and tells you their progress.",
        category: "Terminals",
        subcategory: "Melody Warning"
    })
    .addDropDown({
        configName: "melodyColor",
        title: "Melody Warning Text Color",
        description: "",
        category: "Terminals",
        subcategory: "Melody Warning",
        options: ["Dark Red", "Red", "Gold", "Yellow", "Dark Green", "Green", "Aqua", "Dark Aura", "Dark Blue", "Blue", "Light Purple", "Dark Purple", "White", "Gray", "Dark Gray", "Black"],
        value: 3
    })
    .addDropDown({
        configName: "melodyWarningSound",
        title: "Melody Warning Sound",
        description: "",
        category: "Terminals",
        subcategory: "Melody Warning",
        options: ["note.pling", "mob.blaze.hit", "fire.ignite", "random.orb", "mob.cat.meow"],
        value: 4
    })
    .addSlider({
        configName: "melodyWarningPitch",
        title: "Melody Warning Sound Pitch",
        description: "",
        category: "Terminals",
        subcategory: "Melody Warning",
        options: [0.5, 2],
        value: 1
    })
    .addButton({
        configName: "moveMelodyWarning",
        title: "Move Melody Warning",
        description: "You can set exact positions in the posData.json file in CatgirlYharimAddons's directory.",
        category: "Terminals",
        subcategory: "Melody Warning",
        placeholder: "Move",
        onClick() {
            melodyWarningGui.open()
        }
    })
    .addSwitch({
        configName: "auto4",
        title: "Auto 4",
        description: "(Should be) an effective auto i4.",
        category: "Terminals",
        subcategory: "Auto 4"
    })

    .addSlider({
        configName: "auto4PredictionTimeout",
        title: "Max Prediction Blocks",
        description: "Max amount of blocks that will get predicted before repredicting them.\nOptimal setting may vary with ping.",
        category: "Terminals",
        subcategory: "Auto 4",
        options: [2, 4],
        value: 2
    })
    .addSwitch({
        configName: "auto4Stats",
        title: "Statistics",
        description: "Tells you how many shots it took to finish i4 and how long it took (may not be accurate with lag).",
        category: "Terminals",
        subcategory: "Auto 4"
    })

    .addSwitch({
        configName: "auto4Solver",
        title: "Solver",
        description: "Simple solver that shows what was recently predicted and what it thinks has already been shot.",
        category: "Terminals",
        subcategory: "Auto 4"
    })
    .addColorPicker({
        configName: "predictionColor",
        title: "Prediction Color",
        description: "Color of blocks that were recently predicted.",
        category: "Terminals",
        subcategory: "Auto 4",
        value: [0, 255, 255, 89]
    })
    .addColorPicker({
        configName: "alreadyShotColor",
        title: "Already Shot Color",
        description: "Color of blocks that have already been shot.",
        category: "Terminals",
        subcategory: "Auto 4",
        value: [255, 0, 0, 89]
    })
    .addSwitch({
        configName: "autoRod",
        title: "Auto Rod",
        description: "Automatically rod swaps.",
        category: "Terminals",
        subcategory: "Auto 4"
    })
    .addTextInput({
        category: "Pet Keybinds",
        configName: "petOne",
        title: "#1",
        description: "Index of the Pet you want to click.",
        value: "",
    })
    .addKeybind({
        category: "Pet Keybinds",
        configName: "petOneKeybind",
        title: "Keybind #1",
        description: "Keybind to equip the pet.",
    })
    .addTextInput({
        category: "Pet Keybinds",
        configName: "petTwo",
        title: "#2",
        description: "Index of the Pet you want to click.",
        value: "",
    })
    .addKeybind({
        category: "Pet Keybinds",
        configName: "petTwoKeybind",
        title: "Keybind #2",
        description: "Keybind to equip the pet.",
    })
    .addTextInput({
        category: "Pet Keybinds",
        configName: "petThree",
        title: "#3",
        description: "Index of the Pet you want to click.",
        value: "",
    })
    .addKeybind({
        category: "Pet Keybinds",
        configName: "petThreeKeybind",
        title: "Keybind #3",
        description: "Keybind to equip the pet.",
    })
    .addTextInput({
        category: "Pet Keybinds",
        configName: "petFour",
        title: "#4",
        description: "Index of the Pet you want to click.",
        value: "",
    })
    .addKeybind({
        category: "Pet Keybinds",
        configName: "petFourKeybind",
        title: "Keybind #4",
        description: "Keybind to equip the pet.",
    })
    .addTextInput({
        category: "Pet Keybinds",
        configName: "petFive",
        title: "#5",
        description: "Index of the Pet you want to click.",
        value: "",
    })
    .addKeybind({
        category: "Pet Keybinds",
        configName: "petFiveKeybind",
        title: "Keybind #5",
        description: "Keybind to equip the pet.",
    })
    .addSwitch({
        configName: "i4AutoLeap",
        title: "Auto Leap",
        description: "Leaps to the specified person after you complete 4th device. Seperate from Auto 4 but they are good to use in tandem.",
        category: "Leap",
        subcategory: "4th Device Auto Leap"
    })
    .addSwitch({
        configName: "autoLeapMode",
        title: "Leap to class",
        description: "Leaps to a chosen class instead of a chosen name.",
        category: "Leap",
        subcategory: "4th Device Auto Leap"
    })
    .addDropDown({
        configName: "leapClass",
        title: "Class to leap to",
        description: "",
        category: "Leap",
        subcategory: "4th Device Auto Leap",
        options: ["Archer", "Berserk", "Mage", "Healer", "Tank"],
        value: 4
    })
    .addTextInput({
        configName: "leapPlayer",
        title: "Person to leap to",
        description: "Person to leap to after i4.",
        category: "Leap",
        subcategory: "4th Device Auto Leap",
        value: "ITheSerenity"
    })
    .addSwitch({
        category: "Leap",
        configName: "ee2",
        title: "Leap to EE2",
        description: "Leap to selected class for EE2.",
        subcategory: "Autoleap"
    })
    .addSwitch({
        category: "Leap",
        configName: "ee3",
        title: "Leap to EE3",
        description: "Leap to selected class for EE3.",
        subcategory: "Autoleap"
    })
    .addSwitch({
        category: "Leap",
        configName: "core",
        title: "Leap to Core",
        description: "Leap to selected class for Core.",
        subcategory: "Autoleap"
    })
    .addSelection({
        category: "Leap",
        configName: "ee2Class",
        title: "Class for EE2",
        options: ["Archer", "Berserk", "Mage", "Healer", "Tank"],
        description: "",
        subcategory: "Autoleap"
    })
    .addSelection({
        category: "Leap",
        configName: "ee3Class",
        title: "Class for EE3",
        options: ["Archer", "Berserk", "Mage", "Healer", "Tank"],
        description: "",
        subcategory: "Autoleap"
    })
    .addSelection({
        category: "Leap",
        configName: "coreClass",
        title: "Class for Core",
        options: ["Archer", "Berserk", "Mage", "Healer", "Tank"],
        description: "",
        subcategory: "Autoleap"
    })
    .addSwitch({
        category: "Terminals",
        configName: "coreTimer",
        title: "Core Timer",
        subcategory: "Core Timer",
        description: "Time it takes for everyone to get into core.",
    })
    .addSwitch({
        category: "Simulation",
        configName: "simulation",
        title: "Simulation",
        description: "Simulates 500 speed and lava bounce in singleplayer.",
    })
    .addKeybind({
        category: "ESP",
        description: "Will get fucked by mage witherborn.",
        configName: "witherAimbot",
        title: "Wither Aimbot"
    })
    .addSwitch({
        category: "ESP",
        configName: "espWither",
        title: "Wither ESP",
        description: "ESP for Withers in F7 & M7.",
    })
    .addColorPicker({
        configName: "witherESPColor",
        title: "Wither ESP Color",
        description: "",
        category: "ESP",
        value: [0, 255, 255, 89]
    })
    .addSwitch({
        category: "ESP",
        configName: "espTerminals",
        title: "Terminal ESP",
        description: "ESP for uncompleted Terminals.",
    })
    .addSwitch({
        category: "Clip",
        description: "VClips you down on boss enter.",
        configName: "bossClip",
        title: "Boss VClip"
    })
    .addKeybind({
        category: "Clip",
        description: "Clips through 1 block thick walls. Requires 500 speed (Might work on 400 speed as well). ",
        configName: "blockClipKeybind",
        title: "Wall Clip Keybind"
    })
    .addKeybind({
        category: "Clip",
        description: "",
        configName: "hclipKeybind",
        title: "HClip Keybind"
    })
    .addKeybind({
        category: "Clip",
        description: "§4NOT INCLUDED IN THE PUBLIC VERSION OF CGY, DISABLE THIS IF YOU CAN'T USE IT\nAllows you to teleport somewhere instantly by collecting movement packets and sending them all at once.",
        configName: "blinkKey",
        title: "Blink toggle"
    })
    .addKeybind({
        category: "Leap",
        description: "",
        configName: "tankKeybind",
        title: "Tank Keybind",
        subcategory: "Class Leap"
    })
    .addKeybind({
        category: "Leap",
        description: "",
        configName: "mageKeybind",
        title: "Mage Keybind",
        subcategory: "Class Leap"
    })
    .addKeybind({
        category: "Leap",
        description: "",
        configName: "berserkKeybind",
        title: "Berserk Keybind",
        subcategory: "Class Leap"
    })
    .addKeybind({
        category: "Leap",
        description: "",
        configName: "archerKeybind",
        title: "Archer Keybind",
        subcategory: "Class Leap"
    })
    .addKeybind({
        category: "Leap",
        description: "",
        configName: "healerKeybind",
        title: "Healer Keybind",
        subcategory: "Class Leap"
    })
    .addKeybind({
        category: "Clip",
        description: "Enables/Disables Lava VClip.",
        configName: "lavaVclipKeybind",
        title: "Lava VClip Keybind"
    })
    .addKeybind({
        category: "Wardrobe",
        description: "Automatically equips wardrobe",
        title: "#1 Keybind",
        configName: "wdOneKeybind"
    })
    .addKeybind({
        category: "Wardrobe",
        description: "Automatically equips wardrobe",
        title: "#2 Keybind",
        configName: "wdTwoKeybind"
    })
    .addKeybind({
        category: "Wardrobe",
        description: "Automatically equips wardrobe",
        title: "#3 Keybind",
        configName: "wdThreeKeybind"
    })
    .addKeybind({
        category: "Wardrobe",
        description: "Automatically equips wardrobe",
        title: "#4 Keybind",
        configName: "wdFourKeybind"
    })
    .addKeybind({
        category: "Wardrobe",
        description: "Automatically equips wardrobe",
        title: "#5 Keybind",
        configName: "wdFiveKeybind"
    })
    .addKeybind({
        category: "Wardrobe",
        description: "Automatically equips wardrobe",
        title: "#6 Keybind",
        configName: "wdSixKeybind"
    })
    .addKeybind({
        category: "Wardrobe",
        description: "Automatically equips wardrobe",
        title: "#7 Keybind",
        configName: "wdSevenKeybind"
    })
    .addKeybind({
        category: "Wardrobe",
        description: "Automatically equips wardrobe",
        title: "#8 Keybind",
        configName: "wdEightKeybind"
    })
    .addKeybind({
        category: "Wardrobe",
        description: "Automatically equips wardrobe",
        title: "#9 Keybind",
        configName: "wdNineKeybind"
    })
    .addKeybind({
        category: "Clip",
        description: "",
        title: "Bar Phase Keybind",
        configName: "barPhaseKeybind"
    })
/*
.addSwitch({
    configName: "tickShiftToggle",
    title: "TickShift",
    description: "§cDO NOT USE PROBABLY\nAllows you to go significantly faster for a second after standing still. You need to bind this to a key in Controls.",
    category: "TickShift"
})
.addSlider({
    configName: "tickShiftMaxTicks",
    title: "Max Ticks",
    description: "Suggested value: 20",
    category: "TickShift",
    options: [20, 26],
    value: 20
})
.addSlider({
    configName: "tickShiftSpeed",
    title: "Speed Multiplier",
    description: "Suggested value: 5",
    category: "TickShift",
    options: [1.01, 10],
    value: 5
})
.addButton({
    configName: "moveTickShiftDisplay",
    title: "Move HUD",
    description: "You can set exact positions in the posData.json file in CatgirlYharim's directory.",
    category: "TickShift",
    placeholder: "Move",
    onClick() {
        tickShiftGui.open()
    }
})
    */

const mySettings = new Settings("CatgirlYharimAddons", config, "data/ColorScheme.json")
export default () => mySettings.settings
