<script setup>
import MISAButton from '@/components/base/MISAButton.vue'
import MISATextfield from '@/components/base/MISATextfield.vue'
import MISAToggle from '@/components/base/MISAToggle.vue'
import MISADropdown from '@/components/base/MISACombobox.vue'
import MISARadio from '@/components/base/MISARadio.vue'
import MISACheckbox from '@/components/base/MISACheckbox.vue'
import MISATooltip from '@/components/base/MISATooltip.vue'
import MISASearchBoxVue from '../components/base/MISASearchBox.vue'
import MISAInput from '../components/base/MISAInput.vue'
import MISASkeleton from '../components/base/MISASkeleton.vue'
import MISALoading from '../components/base/MISALoading.vue'
//import sendPostRequest from '@/service/api/testData'

//sendPostRequest(100)
</script>

<template>
  <div class="container">
    <div class="div-flex">
      <MISAButton type="main">Btn main</MISAButton>
      <MISAButton type="main" disabled>Btn main</MISAButton>
    </div>
    <div class="div-flex">
      <MISAButton type="sub">Btn sub</MISAButton>
      <MISAButton type="sub" disabled>Btn sub</MISAButton>
    </div>
    <div class="div-flex">
      <MISAButton type="outline">Btn outline</MISAButton>
      <MISAButton type="outline" disabled>Btn outline</MISAButton>
    </div>

    <div class="div-flex">
      <MISATextfield required label="Textfield" />
      <MISATextfield label="Textfield" defaultValue="Textfield disabled" disabled />
      <MISATextfield label="Textfield" width="200" errorText="Error text" />
    </div>
    <div class="div-flex">
      <MISAToggle />
      <MISAToggle active />
      <MISAToggle active disabled />
    </div>
    <div class="div-flex">
      <MISADropdown required :options="[1, 2, 3, 4, 8, 6, 6, 4, 4, 3]" />
      <MISADropdown :options="[1, 2, 3, 4, 8, 6, 6, 4, 4, 3]" disabled />
    </div>
    <div class="div-flex">
      <MISARadio name="gender" />
      <MISARadio name="gender" />
      <MISARadio name="gender" />
      <MISARadio disabled />
      <MISARadio checked disabled />
    </div>
    <div class="div-flex">
      <MISACheckbox />
      <MISACheckbox disabled />
      <MISACheckbox checked disabled />
    </div>
    <div class="div-flex">
      <MISATooltip content="Tooltip" position="top" text="Hello">
        <MISAButton type="main">Btn main</MISAButton>
      </MISATooltip>
      <MISATooltip content="Tooltip" text="Hello" position="left">Hello</MISATooltip>
      <MISATooltip content="Tooltip" text="Hello" position="right">Hello</MISATooltip>
      <MISATooltip content="Tooltip" text="Hello" position="bottom">Hello</MISATooltip>
    </div>
    <div class="div-flex">
      <MISASearchBoxVue />
      <MISASearchBoxVue placeholder="Hello" disabled />
    </div>
    <div class="div-flex">
      <MISAInput type="string" />
      <MISAInput width="300px" type="number" format />
      <MISAInput type="email" />
    </div>

    <div class="div-flex">
      <MISASkeleton width="300px" height="300px" />
    </div>
    <div class="div-flex">
      <MISALoading />
    </div>
    <!-- <MISADialog @close="togglePopup" open="open" /> -->
  </div>
</template>

<style scoped>
.container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: flex-start;
}
.div-flex {
  display: flex;
  gap: 16px;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}
</style>
