import Settings from "../../config"

let phase
let lastCompleted
let gateBlown
let phaseStartTime
let termsStartTime

const newPhase = () => {
    phase++
    phaseStartTime = Date.now()
    gateBlown = false
    lastCompleted = [0, phase === 2 ? 8 : 7]
}

const resetTerminals = () => {
    phase = 1
    lastCompleted = [0, 7]
    gateBlown = false
    phaseStartTime = 0
    termsStartTime = 0
}

register("chat", (completed, total, event) => {
    if (!Settings().terminalTimestamps) return
    const message = ChatLib.getChatMessage(event, true)
    const unformattedMessage = ChatLib.removeFormatting(message)
    if (unformattedMessage === "[BOSS] Goldor: Who dares trespass into my domain?") {
        termsStartTime = Date.now()
        phaseStartTime = Date.now()
        return
    }
    if (!termsStartTime) return

    // Replace message
    cancel(event)
    const terminalsTime = Date.now() - termsStartTime
    const phaseTime = Date.now() - phaseStartTime
    let newMessage = `${message} &8(&7${(phaseTime / 1000).toFixed(2)}s`
    if (phase != 1) newMessage += ` &8|&7 ${(terminalsTime / 1000).toFixed(2)}s` // The values would be exactly the same in s1 so that would be really ugly to look at...
    newMessage += "&8)"
    ChatLib.chat(newMessage)

    if (unformattedMessage === "[BOSS] Goldor: What do you think you are doing there!") return // Timestamps for these messages because why not
    else if (unformattedMessage === "The gate has been destroyed!") {
        gateBlown = true
        if (lastCompleted[0] == lastCompleted[1]) newPhase()
        return
    } else if (unformattedMessage === "The Core entrance is opening!") {
        resetTerminals()
        return
    }

    if (lastCompleted[0] > completed || lastCompleted[1] != total || (completed == total && gateBlown)) newPhase() // This covers just about every possible condition. It will also work if for some reason it doesn't detect a blown gate or a 7/7 terminal complete message.
    else lastCompleted = [completed, total]
}).setCriteria(/^(?:\w+ \w{9,9} a \w{5,8}! \((\d)\/(\d)\)|The gate has been destroyed!|The Core entrance is opening!|\[BOSS] Goldor: Who dares trespass into my domain\?|\[BOSS] Goldor: What do you think you are doing there!)$/) // This regex is stupidly long but it works and I wanted to have every message in one

register("worldLoad", () => resetTerminals())