<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'

import Likert from './components/Likert.vue'

import { DB, Record } from './db'
import { targets } from './targets'

import type { Ref } from 'vue'
import type { IRecord } from './db';
import type { ITarget } from './targets';

interface IEvaluation {
    id: string;
    ts: string;
    records: IRecord[];
}

const LS_NAME = 'emirror-lct-eval';


const results: IRecord[] = [];

const completed = ref( false );
const recordIndex = ref( -1 );
const record: Ref<IRecord | null> = ref( null );
const targetIndex = ref( -1 );
const debugMessages: Ref<string[]> = ref( [] );

const hasDebugMessages = computed( () => !!debugMessages.value.length );
const hasIntro = computed( () => recordIndex.value < 0 && !completed.value);
const hasImage = computed( () => !!record.value );
const hasNext = computed( () => recordIndex.value == DB.length && targetIndex.value < 0);
const hasTarget = computed( () => targetIndex.value >= 0 );

const targetTitle = computed( () => targetIndex.value >= 0 ? targets[targetIndex.value].title : '' );

function onStart() {
    results.length = 0;
    recordIndex.value = 0;
    record.value = DB[recordIndex.value];
}

function onQuestionnaireAnswer(e: number) {
    if (record.value) {
        const r = record.value;
        Object.assign(r, { amswer: e });
        results.push(r);
    }

    if (++recordIndex.value < DB.length) {
        record.value = DB[recordIndex.value];
    }
    else {
        record.value = null;
        saveResults();
    }
}

function onShowTargets() {
    targetIndex.value = 0;
}

function onNextTarget() {
    if (targetIndex.value < targets.length - 1) {
        targetIndex.value += 1;
    }
    else {
        completed.value = true;
        targetIndex.value = -1;
        recordIndex.value = -1;
    }
}

function imageURL() {
    if (record.value) {
        const name = Record.makeImageName(record.value)
        return `./images/${name}.jpg`;
    }
}

function targetURL() {
    if (targetIndex.value >= 0) {
        const name = targets[targetIndex.value].name;
        return `./targets/${name}.webp`;
    }
}

function saveResults() {
    saveToFile([results.join('\r\n')]);
    saveToLocalStorage(results);
}

function saveToFile(data: string[]) {
    var file = new Blob(data, {type: 'text/plain'});

    let savedDataString = localStorage.getItem(LS_NAME);
    const savedData: IEvaluation[] = savedDataString ? JSON.parse(savedDataString) : [];

    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = URL.createObjectURL(file);
    link.download = 'p' + savedData.length;

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
        URL.revokeObjectURL(link.href);
        link.parentNode?.removeChild(link);
    }, 0);
}

function saveToLocalStorage(records: IRecord[]) {
    let savedDataString = localStorage.getItem(LS_NAME);
    const savedData: IEvaluation[] = savedDataString ? JSON.parse(savedDataString) : [];
    console.dir(savedDataString);
    
    savedData.push({
        id: 'p' + savedData.length,
        ts: new Date().toString(),
        records,
    });

    savedDataString = JSON.stringify(savedData);
    localStorage.setItem(LS_NAME, savedDataString);eval
}

onMounted(() => {
    window.addEventListener( 'error' , (e) => { debugMessages.value.push( `ERROR: ${e.message}` )})
    window.addEventListener( 'keydown', (e) => {
        if (e.key == 'q') {
            recordIndex.value = DB.length - 1;
        }
    });
});

</script>

<template lang="pug">
main
    .instr-container(v-if="hasIntro")
        .instruction.is-centered() Let's evaluate the lane-change safety
        button.go.is-centered(@click="onStart") Start

    .evaluation-container(v-if="hasImage")
        .record-container
            img.record(:src="imageURL()")
        Likert.likert(
            :count="5"
            title="How safe it is to change the lane?"
            @value="onQuestionnaireAnswer")

    .instr-container(v-if="hasNext")
        .instruction.is-centered() Now, lets study the targets!
        button.go.is-centered(@click="onShowTargets") Start

    .instr-container(v-if="hasTarget")
        .instruction.is-centered() {{ targetTitle }}
        img.target(:src="targetURL()")
        button.go.is-centered(@click="onNextTarget") Next

    .instr-container(v-if="completed")
        .instruction.is-centered Done. Thank you!

    h3.debug(v-show="hasDebugMessages")
        div(v-for="err in debugMessages") {{ err }}
</template>

<style>
@import './assets/base.css';
#app {
    margin: 0 1em;
    padding: 0 2em;
    overflow: hidden;
    font-weight: normal;
}

.likert {
    width: inherit;
}

.is-centered {
    width: 50vw;
}

.instruction {
    font-size: 6vh;
    text-align: center;
    margin: 1em 0;
}

.go {
    font-size: 6vh;
    border-radius: 0.25em;
    font-family: inherit;
    padding: 2em 0;
    margin: 1em 0;
}

.instr-container {
    display: flex;
    flex-direction: column;
    margin: 0.5rem;
    align-items: center;
}

.record-container {
    display: flex;
    height: 360px;
}

.record {
    margin: auto;
    min-height: 260px;
}

.target {
    border-radius: 1rem;
    height: 40vh;
    margin: auto;
}

.debug {
    position: fixed;
    left: 1em;
    right: 1em;
    bottom: -0.25em;
    padding: 0.5em 1em;
    text-align: center;

    background-color: var(--color-background-mute);
    border-radius: 0.25em;
    border: rgb(204, 122, 0) 2px solid;
}

</style>
