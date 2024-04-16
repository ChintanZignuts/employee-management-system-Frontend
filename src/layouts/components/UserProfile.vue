<script setup>
import avatar1 from "@images/avatars/avatar-1.png";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import axios from "../../axiosConfig";

const router = useRouter();
const userData = ref(null);

const fetchUserData = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found in localStorage");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get("/user", config);

    userData.value = response.data.user;
  } catch (error) {
    console.error("Failed to fetch user data:", error.message);
    toast.error(error.message);
  }
};

const handleLogout = async () => {
  try {
    const token = localStorage.getItem("token");

    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post("/logout", null, config);

      if (response.status === 200) {
        localStorage.removeItem("token");
        localStorage.removeItem("type");

        router.push("/login");
      }
    } else {
      console.error("Token not found in localStorage");
    }
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

const changePassword = [
  {
    type: "changePassword",
    icon: "tabler-lock-cog",
    title: "Change Password",
    name: "change_password",
  },
];

onMounted(() => {
  fetchUserData();
});
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    bordered
    color="success"
  >
    <VAvatar class="cursor-pointer" color="primary" variant="tonal">
      <VImg :src="avatar1" />

      <!-- SECTION Menu -->
      <VMenu activator="parent" width="230" location="bottom end" offset="14px">
        <VList>
          <!-- 👉 User Avatar & Name -->

          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar color="primary" variant="tonal">
                    <VImg :src="avatar1" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ userData.first_name }} {{ userData.last_name }}
            </VListItemTitle>
            <VListItemSubtitle>Admin</VListItemSubtitle>
          </VListItem>

          <VDivider class="my-2" />

          <!-- 👉 Profile -->
          <VListItem link>
            <template #prepend>
              <VIcon class="me-2" icon="tabler-user" size="22" />
            </template>

            <VListItemTitle>Profile</VListItemTitle>
          </VListItem>

          <!-- 👉 Settings -->
          <!--
            <VListItem link>
            <template #prepend>
            <VIcon
            class="me-2"
            icon="tabler-settings"
            size="22"
            />
            </template>

            <VListItemTitle>Settings</VListItemTitle>
            </VListItem> 
          -->

          <!-- 👉 Pricing -->
          <!--
            <VListItem link>
            <template #prepend>
            <VIcon
            class="me-2"
            icon="tabler-currency-dollar"
            size="22"
            />
            </template>

            <VListItemTitle>Pricing</VListItemTitle>
            </VListItem> 
          -->

          <!-- 👉 FAQ -->
          <VListItem link>
            <template #prepend>
              <VIcon class="me-2" icon="tabler-help" size="22" />
            </template>

            <VListItemTitle>FAQ</VListItemTitle>
          </VListItem>

          <!-- Divider -->
          <VDivider class="my-2" />
          <PerfectScrollbar :options="{ wheelPropagation: false }">
            <template v-for="item in changePassword" :key="item.title">
              <VListItem
                v-if="item.type === 'changePassword'"
                :to="item"
                @click="item.onClick && item.onClick()"
              >
                <template #prepend>
                  <VIcon class="me-2" :icon="item.icon" size="22" />
                </template>

                <VListItemTitle>{{ item.title }}</VListItemTitle>
              </VListItem>
            </template>
          </PerfectScrollbar>

          <!-- 👉 Logout -->
          <VListItem @click="handleLogout">
            <template #prepend>
              <VIcon class="me-2" icon="tabler-logout" size="22" />
            </template>

            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
