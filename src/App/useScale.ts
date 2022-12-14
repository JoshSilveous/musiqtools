import { useEffect, useState } from "react"
import { UseScaleType, scaleSettingsType } from "../global/Types"


export default function useScale(): UseScaleType {
    const scaleDefaultSettings: scaleSettingsType = { tonic: 4, mode: 0, isSharp: false }
    const [scaleSettings, setScaleSettings] = useState(scaleDefaultSettings)
    const scaleLetOptions = scaleSettings.isSharp ?
        ['G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G'] :
        ['Ab', 'A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G']
    const scaleModeOptions =
        ['Ionian (Major)', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian (Minor)', 'Locrian']

    const scaleNum = genScaleNum(scaleSettings.tonic, scaleSettings.mode)

    let scaleLet: string[] = []
    scaleNum.forEach(scaleNumber => {
        scaleLet.push(scaleLetOptions[scaleNumber])
    })
    const [highlightedNotes, setHighlightedNotes] = useState([false, false, false, false, false, false, false, false, false, false, false, false])


    useEffect(() => {
        let savedTonic = localStorage.getItem("current_tonic")
        let savedMode = localStorage.getItem("current_mode")
        let savedIsSharp = localStorage.getItem("current_issharp")

        if (savedTonic && savedMode && savedIsSharp) {
            if (savedIsSharp === "true") {
                setScaleSettings({ tonic: +savedTonic!, mode: +savedMode!, isSharp: true })
            } else {
                setScaleSettings({ tonic: +savedTonic!, mode: +savedMode!, isSharp: false })
            }
            console.log("scaleSettings loaded with ", scaleSettings.tonic, scaleSettings.mode, scaleSettings.isSharp)
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        localStorage.setItem("current_tonic", String(scaleSettings.tonic))
        localStorage.setItem("current_mode", String(scaleSettings.mode))
        localStorage.setItem("current_issharp", String(scaleSettings.isSharp))
        console.log("localStorage updated with ", scaleSettings.tonic, scaleSettings.mode, scaleSettings.isSharp)
    }, [scaleSettings])

    return ({
        scaleNum,
        scaleLet,
        scaleSettings,
        setScaleSettings,
        scaleLetOptions,
        scaleModeOptions,
        highlightedNotes,
        setHighlightedNotes
    })

}

function genScaleNum(tonic: number, mode: number) {
    let scaleFormula: number[] = []
    switch (mode) {
        case 0: scaleFormula = [2, 2, 1, 2, 2, 2]; break
        case 1: scaleFormula = [2, 1, 2, 2, 2, 1]; break
        case 2: scaleFormula = [1, 2, 2, 2, 1, 2]; break
        case 3: scaleFormula = [2, 2, 2, 1, 2, 2]; break
        case 4: scaleFormula = [2, 2, 1, 2, 2, 1]; break
        case 5: scaleFormula = [2, 1, 2, 2, 1, 2]; break
        case 6: scaleFormula = [1, 2, 2, 1, 2, 2]; break
        default: scaleFormula = [1, 1, 1, 1, 1, 1]; break
    }

    let scale = [tonic]
    scaleFormula.forEach(interval => {
        let nextScaleNum = scale[scale.length - 1] + interval
        if (nextScaleNum > 11) { nextScaleNum = nextScaleNum - 12 }
        scale.push(nextScaleNum)
    })
    return scale
}