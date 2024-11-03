import Settings from "./config"
import "./features/Serenity/MelodyWarning"
import "./features/Serenity/Relic"
import "./features/Serenity/TerminalTimestamps"
import "./features/Serenity/Auto4"
import "./features/Serenity/AutoLeap"
import "./features/Serenity/StormTickTimer"
import "./features/Serenity/StonkSwap"
import "./features/Serenity/StonkSwapDing"
import "./features/Serenity/PartyFinderSound"
import "./features/Serenity/BlockClip"
import "./features/Serenity/AlwaysSprint"
// import "./features/Serenity/TickShift" // DO NOT USEEEEE

// gatekeep for now maybe
import "./SereneBlink/Blink"
import "./SereneBlink/BlinkRelics"

// I take no responsibilty for Turtle's incredibly schizo code. -Serenity. Nigger -Turtle
import "./features/Turtle/AutoP3"
import "./features/Turtle/LeapKeybinds"
import "./features/Turtle/WardrobeKeybinds"
import "./features/Turtle/PetKeybinds"
import "./features/Turtle/HClip"
import "./features/Turtle/VClip"
import "./features/Turtle/CoreTimer"
import "./features/Turtle/Simulation"
import "./features/Turtle/BossESP"
import "./features/Turtle/TerminalESP"
import "./features/Turtle/BarPhase"
import "./features/Turtle/getInventory"

import "./features/Shared/DragPrio"

import "./commands/pearl"
import "./commands/panes"
import "./commands/commands"

register("command", () => {
    Settings().getConfig().openGui()
}).setName("catgirlyharimaddons").setAliases("catgirlyharim", "cgy")

register("command", () => ChatLib.command("joininstance CATACOMBS_ENTRANCE")).setName("f0") // Adds a command to go into entrance cause why not