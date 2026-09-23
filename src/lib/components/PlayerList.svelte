<script lang="ts">
    import { allPlayers } from "$lib/data/placeholder";
</script>

<div class="overflow-x-auto">
  <table class="table">
    <!-- head -->
    <thead>
      <tr>
        <th>Username</th>
        <th>Matches</th>
        <th>Wins</th>
        <th>Win Rate</th>
        <th>Ranked Matches</th>
        <th>Ranked Wins</th>
        <th>Elo</th>
        <th>Tier</th>
        <th></th>
      </tr>
    </thead>
    <tbody>

      <tr>
        <td>
          <div class="flex items-center gap-3">
            <div class="avatar">
              <div class="mask mask-squircle h-12 w-12">
                <img
                  src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                  alt="Avatar Tailwind CSS Component" />
              </div>
            </div>
            <div>
              <div class="font-bold">Hart Hagerty</div>
              <div class="text-sm opacity-50">United States</div>
            </div>
          </div>
        </td>
        <td>
          Zemlak, Daniel and Leannon
          <br />
          <span class="badge badge-ghost badge-sm">Desktop Support Technician</span>
        </td>
        <td>Purple</td>
        <th>
          <button class="btn btn-ghost btn-xs">details</button>
        </th>
      </tr>
    </tbody>
    <tfoot>
        <!-- pagination? -->

    </tfoot>
  </table>
</div>
