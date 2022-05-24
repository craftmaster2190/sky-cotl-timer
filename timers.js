// moment
function now() {
    return moment().tz("America/Los_Angeles");
}

// string
function durationUntil(time) {
    const duration = moment.duration(time.diff(now()));
    if (duration.asHours() > 2) {
        return duration.humanize();
    } else if (duration.asMinutes() > 2) {
        return Math.round(duration.asMinutes()) + " minutes";
    } else {
        return Math.round(duration.asSeconds()) + " seconds";
    }
}

// moment
function nextEyeOfEdenReset() {
    return now().startOf("week").add(1, "week");
}

// moment
function nextDailyLightReset() {
    return now().startOf("day").add(1, "day");
}

// Tuple [moment, moment]
function nextSanctuaryGeyser() {
    let start = now().startOf("day");
    let end = start.clone().add(15, "minute");
    while (end.isBefore(now())) {
        start = start.add(2, "hour");
        end = start.clone().add(15, "minute");
    }
    return [start, end];
}

// Tuple [moment, moment]
function nextHiddenForestGrandmasDinner() {
    let start = now().startOf("day").add(30, "minute");
    let end = start.clone().add(15, "minute");
    while (end.isBefore(now())) {
        start = start.add(2, "hour");
        end = start.clone().add(15, "minute");
    }
    return [start, end];
}

// Tuple [moment, moment]
function nextSanctuaryTurtle() {
    let start = now().startOf("day").add(50, "minute");
    let end = start.clone().add(10, "minute");
    while (end.isBefore(now())) {
        start = start.add(2, "hour");
        end = start.clone().add(10, "minute");
    }
    return [start, end];
}

function cache(name, until) {
    function isChecked() {
        const stringValue = localStorage.getItem(name);
        if (stringValue) {
            const jsonValue = JSON.parse(stringValue);
            if (now().isBefore(moment.unix(jsonValue.expiry))) {
                return jsonValue.value;
            }
        }
        return false;
    }

    function toggleCheck() {
        const newIsChecked = !isChecked();
        localStorage.setItem(name, JSON.stringify({value: newIsChecked, expiry: until.unix()}));
        return newIsChecked;
    }

    return {
        isChecked: isChecked,
        toggleCheck: toggleCheck
    };
}

function timerHtml() {
    console.log("now", now().format());
    jQuery(".now .statusText").html("Now: " + now().format());

    console.log("nextEyeOfEdenReset happens in", durationUntil(nextEyeOfEdenReset()), "at", nextEyeOfEdenReset().format());
    jQuery(".nextEyeOfEdenReset .statusText").html("The Eye of Eden resets in " + durationUntil(nextEyeOfEdenReset()));

    console.log("nextDailyLightReset happens in", durationUntil(nextDailyLightReset()), "at", nextDailyLightReset().format());
    jQuery(".nextDailyLightReset .statusText").html("Your Daily Light resets in " + durationUntil(nextDailyLightReset()));

    if (nextSanctuaryGeyser()[0].isBefore(now())) {
        console.log("nextSanctuaryGeyser happening now! for another", durationUntil(nextSanctuaryGeyser()[1]),
            "[", nextSanctuaryGeyser()[0].format(), "-", nextSanctuaryGeyser()[1].format(), "]");
        jQuery(".nextSanctuaryGeyser .statusText").html("The Sanctuary Polluted Geyser is happening now for another " + durationUntil(nextSanctuaryGeyser()[1]));
    } else {
        console.log("nextSanctuaryGeyser happens in", durationUntil(nextSanctuaryGeyser()[0]),
            "[", nextSanctuaryGeyser()[0].format(), "-", nextSanctuaryGeyser()[1].format(), "]");
        jQuery(".nextSanctuaryGeyser .statusText").html("The Sanctuary Polluted Geyser will blow in " + durationUntil(nextSanctuaryGeyser()[0]));
    }

    if (nextHiddenForestGrandmasDinner()[0].isBefore(now())) {
        console.log("nextHiddenForestGrandmasDinner happening now! for another", durationUntil(nextHiddenForestGrandmasDinner()[1]),
            "[", nextHiddenForestGrandmasDinner()[0].format(), "-", nextHiddenForestGrandmasDinner()[1].format(), "]");
        jQuery(".nextHiddenForestGrandmasDinner .statusText").html("Hidden Forest Grandma is serving dinner right now for another " + durationUntil(nextHiddenForestGrandmasDinner()[1]));
    } else {
        console.log("nextHiddenForestGrandmasDinner happens in", durationUntil(nextHiddenForestGrandmasDinner()[0]),
            "[", nextHiddenForestGrandmasDinner()[0].format(), "-", nextHiddenForestGrandmasDinner()[1].format(), "]");
        jQuery(".nextHiddenForestGrandmasDinner .statusText").html("Hidden Forest Grandma will serve dinner in " + durationUntil(nextHiddenForestGrandmasDinner()[0]));
    }

    if (nextSanctuaryTurtle()[0].isBefore(now())) {
        console.log("nextSanctuaryTurtle happening now! for another", durationUntil(nextSanctuaryTurtle()[1]),
            "[", nextSanctuaryTurtle()[0].format(), "-", nextSanctuaryTurtle()[1].format(), "]");
        jQuery(".nextSanctuaryTurtle .statusText").html("The Sanctuary Turtle (Sunset) is spewing out wax right now for another " + durationUntil(nextSanctuaryTurtle()[1]));
    } else {
        console.log("nextSanctuaryTurtle happens in", durationUntil(nextSanctuaryTurtle()[0]),
            "[", nextSanctuaryTurtle()[0].format(), "-", nextSanctuaryTurtle()[1].format(), "]");
        jQuery(".nextSanctuaryTurtle .statusText").html("The Sanctuary Turtle (Sunset) will spew out wax in " + durationUntil(nextSanctuaryTurtle()[0]));
    }
}

function initHtml() {
    Object.entries({
        "collectedAscendedCandlesCheckbox": nextEyeOfEdenReset(),
        "collectedCandlesCheckbox": nextDailyLightReset(),
        "collectedSeasonalCandleCheckbox": nextDailyLightReset(),
        "completedSeasonalQuestsCheckbox": nextDailyLightReset(),
        "visitTheGeyserCheckbox": nextDailyLightReset(),
        "visitGrandmaCheckbox": nextDailyLightReset(),
        "visitTheTurtleCheckbox": nextDailyLightReset(),
    }).forEach(([name, expiry]) => {
        const checkboxNamedCache = cache(name, expiry);
        jQuery("#" + name).prop("checked", checkboxNamedCache.isChecked());
        jQuery("#" + name).change(checkboxNamedCache.toggleCheck);
    });
}

jQuery(document).ready(function main() {
    moment.tz.add("America/Los_Angeles|PST PDT|80 70|0101|1Lzm0 1zb0 Op0");

    initHtml();
    timerHtml();
    setInterval(function () {
        timerHtml();
    }, 1000);
});
