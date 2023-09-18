<template>
  <div class="login-form">
    <img class="img-background__login" src="/src/assets/image/Login.webp" alt="Login" />
    <div class="form__login">
      <img class="logo-misa" src="/src/assets/image/logo.svg" alt="Logo" />
      <div class="logo-text">Đăng nhập để làm việc với <span class="medium">MISA QLTS</span></div>
      <div class="show-popup_login"></div>
      <div class="input-container">
        <!-- <MISACombobox size="large" zIndex="3" :options="[1, 2, 3, 4]" />
        <MISACombobox size="large" :options="[1, 2, 3, 4]" /> -->
        <MISATextfield
          defaultValue=""
          @on-change="(v) => (data.credential = v)"
          placeholder="Tên đăng nhập, email hoặc số điện thoại"
          height="40px"
        />
        <MISATextfield
          defaultValue=""
          @on-change="(v) => (data.password = v)"
          type="password"
          height="40px"
          placeholder="Mật khẩu"
        />
      </div>
      <div class="button-container">
        <MISAButton
          @click="onSubmit"
          :style="{ fontSize: '16px' }"
          backgroundColor="#2b4eee"
          width="100%"
          >Đăng nhập</MISAButton
        >
        <RouterLink to="authentication/forgot" class="btn-space">Quên mật khẩu?</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import authenticateApi from '@/service/api/authenticateApi'
import router from '@/router/index.js'

const data = ref({
  credential: '',
  password: ''
})

const onSubmit = async () => {
  console.log(data.value)
  const response = await authenticateApi.login(data.value)
  if (response) {
    console.log(response)
    router.push('/')
  }
}
</script>

<style scoped>
.login-form {
  height: 497px;
  width: 770px;
  background-color: var(--color-white);
  border-radius: 6px;

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
}
.img-background__login {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  overflow: hidden;
}
.form__login {
  width: 100%;
  height: 100%;
  padding: 30px 44px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.logo-misa {
  height: 49px;
  width: 114px;
  object-fit: cover;
  object-position: center;
}
.logo-text {
  text-align: center;
  margin: 24px 0 0;
  font-size: 14px;
  line-height: 17px;
  color: #586074;
}
.logo-text span.medium {
  font-weight: 600;
}
.show-popup_login {
  height: 20px;
  color: #f93154;
  width: 300px;
  font-size: 12px;
  font-family: inherit;
  display: flex;
  align-items: center;
}
.input-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.button-container {
  margin-top: 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 3px;
}

.btn-space {
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
  line-height: 17px;
  cursor: pointer;
  color: #2b4eee;
  font-weight: 600px;
  text-decoration: none;
}
.btn-space:hover {
  text-decoration: underline;
}
</style>
