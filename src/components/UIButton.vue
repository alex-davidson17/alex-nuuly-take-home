<template>
  <button class="ui-button">
    <slot />
  </button>
</template>

<style>
.ui-button {
    display: inline-block;
    outline: 0;
    text-align: center;
    cursor: pointer;
    padding: 0px 16px;
    border-radius: 10px;
    min-width: 80px;
    height: 32px;
    background-color: rgb(0, 120, 212);
    color: rgb(255, 255, 255);
    font-size: 14px;
    font-weight: 400;
    box-sizing: border-box;
    border: 1px solid rgb(0, 120, 212);
    :hover {
        background-color: rgb(16, 110, 190);
        border: 1px solid rgb(16, 110, 190);
    }
}
</style>
