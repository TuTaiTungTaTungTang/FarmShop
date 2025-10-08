// navigation Data
export const navItems = [
  {
    title: "Trang Chủ",
    url: "/",
  },
  {
    title: "Bán Chạy",
    url: "/best-selling",
  },
  {
    title: "Sản Phẩm",
    url: "/products",
  },
  {
    title: "Sự Kiện",
    url: "/events",
  },
  {
    title: "Câu Hỏi Thường Gặp",
    url: "/faq",
  },
];

// branding data
export const brandingData = [
  {
  id: 1,
  title: "Miễn phí vận chuyển",
  Description: `Miễn phí cho đơn hàng từ ${require('../utils/currency').default.formatPriceFromUsd(100)}`,
    icon: (
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 1H5.63636V24.1818H35"
          stroke="#FFBB38"
          stroke-width="2"
          stroke-miterlimit="10"
          stroke-linecap="square"
        ></path>
        <path
          d="M8.72763 35.0002C10.4347 35.0002 11.8185 33.6163 11.8185 31.9093C11.8185 30.2022 10.4347 28.8184 8.72763 28.8184C7.02057 28.8184 5.63672 30.2022 5.63672 31.9093C5.63672 33.6163 7.02057 35.0002 8.72763 35.0002Z"
          stroke="#FFBB38"
          stroke-width="2"
          stroke-miterlimit="10"
          stroke-linecap="square"
        ></path>
        <path
          d="M31.9073 35.0002C33.6144 35.0002 34.9982 33.6163 34.9982 31.9093C34.9982 30.2022 33.6144 28.8184 31.9073 28.8184C30.2003 28.8184 28.8164 30.2022 28.8164 31.9093C28.8164 33.6163 30.2003 35.0002 31.9073 35.0002Z"
          stroke="#FFBB38"
          stroke-width="2"
          stroke-miterlimit="10"
          stroke-linecap="square"
        ></path>
        <path
          d="M34.9982 1H11.8164V18H34.9982V1Z"
          stroke="#FFBB38"
          stroke-width="2"
          stroke-miterlimit="10"
          stroke-linecap="square"
        ></path>
        <path
          d="M11.8164 7.18164H34.9982"
          stroke="#FFBB38"
          stroke-width="2"
          stroke-miterlimit="10"
          stroke-linecap="square"
        ></path>
      </svg>
    ),
  },
  {
  id: 2,
  title: "Ưu đãi hàng ngày",
  Description: "Tiết kiệm đến 25%",
    icon: (
      <svg
        width="32"
        height="34"
        viewBox="0 0 32 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M31 17.4502C31 25.7002 24.25 32.4502 16 32.4502C7.75 32.4502 1 25.7002 1 17.4502C1 9.2002 7.75 2.4502 16 2.4502C21.85 2.4502 26.95 5.7502 29.35 10.7002"
          stroke="#FFBB38"
          stroke-width="2"
          stroke-miterlimit="10"
        ></path>
        <path
          d="M30.7 2L29.5 10.85L20.5 9.65"
          stroke="#FFBB38"
          stroke-width="2"
          stroke-miterlimit="10"
          stroke-linecap="square"
        ></path>
      </svg>
    ),
  },
  {
  id: 4,
  title: "Giá cả phải chăng",
  Description: "Giá trực tiếp từ nhà máy",
    icon: (
      <svg
        width="32"
        height="35"
        viewBox="0 0 32 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 13H5.5C2.95 13 1 11.05 1 8.5V1H7"
          stroke="#FFBB38"
          stroke-width="2"
          stroke-miterlimit="10"
        ></path>
        <path
          d="M25 13H26.5C29.05 13 31 11.05 31 8.5V1H25"
          stroke="#FFBB38"
          stroke-width="2"
          stroke-miterlimit="10"
        ></path>
        <path
          d="M16 28V22"
          stroke="#FFBB38"
          stroke-width="2"
          stroke-miterlimit="10"
        ></path>
        <path
          d="M16 22C11.05 22 7 17.95 7 13V1H25V13C25 17.95 20.95 22 16 22Z"
          stroke="#FFBB38"
          stroke-width="2"
          stroke-miterlimit="10"
          stroke-linecap="square"
        ></path>
        <path
          d="M25 34H7C7 30.7 9.7 28 13 28H19C22.3 28 25 30.7 25 34Z"
          stroke="#FFBB38"
          stroke-width="2"
          stroke-miterlimit="10"
          stroke-linecap="square"
        ></path>
      </svg>
    ),
  },
  {
  id: 5,
  title: "Thanh toán an toàn",
  Description: "Thanh toán được bảo vệ 100%",
    icon: (
      <svg
        width="32"
        height="38"
        viewBox="0 0 32 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.6654 18.667H9.33203V27.0003H22.6654V18.667Z"
          stroke="#FFBB38"
          stroke-width="2"
          stroke-miterlimit="10"
          stroke-linecap="square"
        ></path>
        <path
          d="M12.668 18.6663V13.6663C12.668 11.833 14.168 10.333 16.0013 10.333C17.8346 10.333 19.3346 11.833 19.3346 13.6663V18.6663"
          stroke="#FFBB38"
          stroke-width="2"
          stroke-miterlimit="10"
          stroke-linecap="square"
        ></path>
        <path
          d="M31 22C31 30.3333 24.3333 37 16 37C7.66667 37 1 30.3333 1 22V5.33333L16 2L31 5.33333V22Z"
          stroke="#FFBB38"
          stroke-width="2"
          stroke-miterlimit="10"
          stroke-linecap="square"
        ></path>
      </svg>
    ),
  },
];

// categories data
export const categoriesData = [
  {
    id: 1,
    title: "Gạo",
    value: "Rice",
    subTitle: "",
    image_Url: "https://cdn.img.kevesko.vn/img/07e4/0c/08/9811941_0:104:2000:1229_1920x0_80_0_0_5f57c7b51393d463ecbeda1d548f5e3c.jpg",
  },
  {
    id: 2,
    title: "Rau củ",
    value: "Vegetables",
    subTitle: "",
    image_Url: "https://iwater.vn/Image/Picture/New/333/rau_cu.jpg",
  },
  {
    id: 3,
    title: "Trái cây",
    value: "Fruits",
    subTitle: "",
    image_Url: "https://thanhnien.mediacdn.vn/Uploaded/ngocthanh/2015_10_25/trai-cay_CZLU.jpg?width=500",
  },
  {
    id: 4,
    title: "Cà phê",
    value: "Coffee",
    subTitle: "",
    image_Url: "https://file.hstatic.net/1000274203/article/cach_nhan_biet_ca_phe_nguyen_chat_bb185d1fe58a40bfa2d630ede6e8b555.jpg",
  },
  {
    id: 5,
    title: "Mật ong",
    value: "Honey",
    subTitle: "",
    image_Url: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2023_10_25_638338407967406388_phan-biet-mat-ong-that-gia.png",
  },
  {
    id: 6,
    title: "Trứng",
    value: "Eggs",
    subTitle: "",
    image_Url: "data:image/jpeg;base64,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",
  },
  {
    id: 7,
    title: "Sản phẩm từ sữa",
    value: "Dairy",
    subTitle: "",
    image_Url: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxIQERUSEhIWFhUXFhYXGBUVFxUXFhUWFxUXFxcXFRUYHSggGBolHRcVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGi0lICYrLS0tLS0tLS0tLS0tLS0tLS0tLS01LS0tLS0tLS0tLS0tLSstLS0tLS0tLSstLS0tLf/AABEIALEBHAMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAAAAQMEBQYCB//EAEkQAAIBAgQDBQUDCAgFAwUAAAECEQADBBIhMQVBUQYiYXGRE4GhscEy0fAHI0JScoKSshQVM0NzwtLhJFNiovFjk6MWVKTT4v/EABoBAAIDAQEAAAAAAAAAAAAAAAABAgMEBQb/xAAqEQACAgEEAQEIAwEAAAAAAAAAAQIRAwQSITFBExQiIzJRYXHBBUKRM//aAAwDAQACEQMRAD8A9xpKWigAooooASilooAKSlooAKSlooASloooAKKKKAEpaiYnHKrBBBc6wWA069fQGuBcuHmo8ApPxJ+lAE2g1EDPP2j6L91dd79Y/wDb91FgSqQ1EOb9dv8At+6uC7j+89VBPoIpWBPrlmjeoJa8dmQeJQz7gHqNfsc2vXPMFFA8oWR60WBYti0GpJjrBge+KeRpAI2PTUetYHF8TK3AmHxt0uVzKjIl5H8u6HYeKmtR2YwdyxYFu5lkM+ULMBCZAAOq7nuyYECdKEwLikpaKYBRRRQAUlLRQAUUUUAFJS0UAIKKWigAopKKAFopKKAFpKKKAFopJrgOJidaVgOUUlFMBaKSigBaQmo+JvEQqxmO07DxP3c/jUFuFq5zXXuOf2mVR5IpA+dAELtQlklM+pJjKADMa6jl507wmwhTuuxG32nSCORUGJ91OcV4bba3ogHeGvPUjUnfcJ6VVYC4UxK2wTlNu4T5pcAH/awHuFQ8jNC1no7j+E/zKa59k/8AzW94t/RaW7cCDMxAUcyYHqaRMchmDMcwCR6gU7ABbbm5PuUfIT8adtqBVTxTjTWv7Ow94wTCBuWw0U701wHj1zEjv4V7La925mWPeyjXyBosC9uNA0qvxNnOpDDQ8utTbgNU3HrrrabI0MQQD0JBAPuMH3UAV/YThpS5duPkdw91TeFu2ruPaQoYqBsqgGNJFbWqns1w0YeyAJJY5iTv4T+OdW1NCFopKKYC0UlFAC0UlFAC0UlFAC0lFFAC0UlFABRRFEUAEURRFFABVPxvjiYfujvXP1eQ8WP0prtDxwWRkQzcP/b5+NYxiWaSSSeZ3rm63Xxwqk+TZp9K5+9LolYriV68Tmc+QMKPIbVN7LW/Z4gMf0gV9ROnvAqPhsOAKlWWyOrdGB9DWPTuc5LJMvzOKi4RNvRFAorvHMCKKKQmNaAI5XvFuvy/EUxbW7cM5gicoALt4ydAPdTeGuEWAx3yz661ZIsADppSQyNcwCsCGLGerH6QKyruRcJORLmVkU3HZFUuwJPc1J0AgMD46zW1rGC+iYh3Ju6sdFaUE6TlPu/ApSpAi2wfDLZhyyXLgGrqts+cMczAfvHzqz9kIiT/ABN99Vtuzh7gzMttvF7YB9a5u4HB7Zsvgt24g9FYCgB/E8Js3BlLXVH/AKeJxFs+tu4DXfD8ClgZVu3SJ/vb9y8f4rrMY99QP6swf/N//IufV6k2eHYYDR//AJX/ANVADmLwAeSrFWPMBdD1mJ9CKzPFcRcF7DW2IBAZ7sEsCFXLA1mCzA69OtX13+iKYa6s9GuM/wAGJqrxa4QYi1et5DcUhJGhyFgYmNYKrp4mlYGxUQKWiKKmIIoiiigAoiiigAooiiKACKIoiigAiiiiKACKIooigAooooAKquPcWGHTT7bfZH1PhUviGNFm2XPLYc2PICsccLdvublw6nlyA5AeVc7X6t4Y7YK5M06fCpu5dIqySzFmMk1LwtrmasrPCBzNNG3lJHSvP6fTZJ5d2Xr9nSyZoqNQOkFcXa7mmbpmu02kjD2zZ4C5mtI3VR8takVV9nLuawB+qSPjP1q0BrqY5bopmOSp0FRuJPls3G6I59FNSag8bP8Aw939g1J9CGlH5i2Ootj1gVZ1XOO5bH/Vb+YqxoQ2cX2yqT0B+VZHD2NZ8RWm4o8Wm8YHqapMOu3nVWV80OJMWz3YqrxvD1Y/dVlxS69uyTbAL7Cdgepqq4IX9nlunMwJOaZkMZ385quU+aJKPFjDcLHU1ZYO1lQD8b104p6wO7TUmDKzGWRnmNxVdi7JkQI1HwM1eYwajyqFik+dRbdgbC02ZQeoB9RUPF48JdW3opZZDPoCZjKv6zc4kcqd4Y82U/ZA9NKZ4jdVWXORlht9t19a1XwVjpz/AK/oo+s0rBv1z6L91Ul3GYYTlVx/hl0/lIqFc4ugGjYseRDfFwajvRKjS5n/AFz6L91de1Ycwfd9xrN4LiqOSPa4mf8AqFkfEIKMZj8OGyvfviQNC9xR7zbAj1o3oKNF/WChlRoUuYXX7RAJgDfYH0qbWAwViyeKYX2agkWsRcLyXZgFRF/OMSSPzh0n5Vv6kiIUUTRTAKKKKACiiiaACiio+Ov5LbNzA08zoPjFRk1FWwStlVjbntX/AOlSQPEjQn7qQJXGHWBTtcb525PybOlSBarOIrD+etWYqFxddFNWLoS7IDmuGFJmou3AqlmIAHM1VJliRe9lH7rr0IPqI+lX9ZTsfild3ymQV+R/3rSnF2w4tl1zkSEzDMR1y7109LJPEjJlVTY9ULjQmxd/YNTQaj8RTNauDqjj1U1ofRWhlhK2vNKnVW4Z81my3UWj6gVZULobK3jb90DqZ+n1qFYXan+LNLgdB/v91c2RrWefMiS6GuN6oBO5+n+9R8Fayr5n/b76d4uZYDypbY7o8vnrVXc2T/qcvTuH+z6009PWNvWprsiMYwaio15ZFSsZypg7UpdjLjgLzaA6Ej6/WqbtmzC7Yg8nkcjqvKrLs83218QfmPoKr+2X9pY/f/y1bJ/DsivmGLNwkagU5cE8qbsHapC1WpsbRzhbcE0zj8OrNJHKp1kb0xi9zT3cCog9m8Mgx+YLqLLiZ5F7fL3D0rb1keywnF3T0tAfxP8A/wA1rquxu4kZdhRRRVggooooAKKKKAFqs480WvNk/mn6VZVXcdWbXky/zR9ap1H/ACl+CeP5kQrO1KaRNqK5cejQ+wFR+KJ3D+OYH1p55jTflTJtt7Hv75TPwNNukNFIjU3j0zLFdjemceWAlelZpPgvXZb9j7KojuB3lUwNp5/T41CXhti/dF4rb9qAmrhQ7Pnl2N0a5hJgjaPdXPZS60sGkSrCPdXfDsMr3sjKCCTIPMDMa26TJ8KKSM+WPvtmkscMQ5gz3m7x3vXiCDqIGeNtPdXV3g9nKYQzB/ScHbqGmmLXCbJ/QjUjTTQGBt4Cm+IYO9aQvh3csokW2OZWjddeoro26M1EkcJtovdu3bYUAz7Z2VY1+xcLIAPKl4TxM3HNufaAAn2qiAYIEHkT5aaVkrfEsTxJrdo2xbtjL7UEnO1wN3gRGiKoOp3Zh+qRWu4dANxlAAAhQBAA5fIUt3PAVwMYl81wn8fjau7BM1HtmSTUmwKpu2ToiYvvOT+NKe/2pkiWNRuI8XsYeDfvJaBMA3GCgnoCdzUIdtkpdUTGpyxt61R2+1OBeQuMw5gT/apoOu+1W3D8ZauL+buI+v6Dq3yNTXZBo6xew86ZG1ScUunvqMtKXY0SOCPF0jqD9/0qP2y+1Z/f/wAlLg3y3VPj86O2Y/sf3/8ALUr+G0L+xDsnQVLt1Bw7aVNtHSq4kmP2zBpjEnU07UbEmmId7Ir+dxDeFsfzmtG2Ltjd1Hmwrz/BFszsyubIuKCRGTNA+0BqYkbiNRzrUDEKv2XT+D6rFaISpEJLkuFxVs7Op8mBp0GapHxYbf2Z95+RWi4EUSLaTyIZVPqBNT3Cou5orJ8H7SM+Iu2mWEtqNQxuMzsSAiaAk91tNfdT2J7ZJavLZuYbEKzAle4hlVBJIUPLQATCgt4U0wo01FM4PFJeQPbYMrCQR+NDOkcqfpiEqDxlZst+6fRganVG4iJtXP2G+RqGRXBr7Dj2iptHSm72KRWCFgGbZeZ8q6s7UzfwKPcW4ftLz6jy61xblt4NnF8kiaYwmDyhyxJJnny5U8evIVxhMWl0HI4aNDBmpOmLkoLh1rm48CelLeHeMdaqrmNNwMgIHKfKs26kaKssOGY4G5poZAq64bgmS6XfTcAbzmkT5a1Rdk+DF2Nwk5FP8TdPIVtkArdo4tx3SM+eSukM3cZcAGVZ8YNcJxK5syD3TPzpcSo5VXXQZ3itrk0Z0i3XGxMpB2kn6xUTD4gBHA30299UWPzT9qm8FiMnPeoPJyTUOC4s3YFU78Xa7xC3hkvZVQy6DRnyqzkE7kaLptBM04+Iiqzg6+04o9yP7PDnX/qLKonxhm+NVbyyMbtmxtW8zGnLyrkZWAKkQVIkEbQQeVYP8qHGLuGsWBYuMjtdJLIcpyop0nzZfSsPa7ccR532P7S2z8ctSjPahrDKfR7KnDLSiBat5YyxkT7P6u22g08Kh/8A01hwPzVtbRh49moCqXAlhbjJm0GsT615gO3vETp7T/47c/y1Mvcfx77tf/js2/5Umn6sSXs0y9xuBx2AfMuLX+jhVVbbsxyhEA1RhrJGpGutarg+PGIspdHOZjaQYMdRM143ibTu2a8zN+07OfKTXr3BSow1kKAB7JDAHVQTp5zUY5FN8CzYXjSsm3DGvSnO1l3Nbst1k+oWo5k76eJpcUgvJatFtVJOnMHYeFW09rRn8or8PfFWFm+K5XhtpWEId+rEaczUvH24TMtuYnuga+PvqCQ2FoljAqDxJ8kg7irLh9vQMIE7gGeXWnLuHS6ZZAdN25jc+6mIquzhDcPdj+lePwZV/wAtTLC/iKfOAC2/ZpoudnyiAJYlm8hLTFcrby7Gam/FCO/YT09KMXYkCadtPqBXeKWmIgcDwCi69xAAZ7x3aCq6CdgcgmP1ausdg8yNk0uZTkeASrRoddxMSOdV3BGy3nUn7SgjpodffqPSrLjOOXD4e7eYwERm9Bp8Yq6HKIvsqeyWPF63buhcov2xcKDZbqkLcA95H8NaKs92MwPssJYUjUKxPgXOYj1atDUl0DCm7yypHUEeoryRfyl47/l2f4H/ANdcP+U/Gj+7sfwv/rpPlD2s31i4AFHXwpx7bFhBgaz41F4PiBds2rsDvIrabDMoOlTDXGivBqZG4naLWbijcqarezWEKCdvrV4tUvEuOFLvsrSAkHXz6CPnVWWMVJTb+xODbTihniqhGjxn1rP3sOC4ySCxAjkSxjTpqa0XE0Nw54I0G/ltVVwhM2Msqf1if4VZh8QKrirnRZdRs3WBwotW1trsoA8zzPzqQbelKtKz6V3UklRz22yFdWod5anXTUK+ahIaKviNsAHrp7+tZTG4o228D8+RrX44ZgT0FYzj1vuk1my8GnErO04lKkE1bdglzNi7p5m0g9ysT81rz7EYohd69H/Jzb/4LMd7l1m9Aqj5GopdMlLhNGU/KvezX0t8rdtfcWJJ+GWsRYOlaXtpifbYi+3/AKhUeSHIPgtZy1VcpWjdjjtolWVnU1pMXiu6AD0npWbsnWrW63dH42qqJofJCxj8zXq3ZSGwVi5GvsxBmQQBAPp9a8a4rd7prY9iO03sbVmzc1tFQp11U7BlPKtemjSs5+uldI9FRDdYqrARHxqQuAFktckswXbnGswOu9d8Oa0oAUjYanQnxPKa6vW2uNExoQdNd+Rq+bdHPQxgcWjFnVs0lRvtzGnpUwPlIURr6Tvp6V1h8FbRQiiAAABz069TVVax2bGGy5AyqXQCe/qAdeonb6VC9tJku7ossUZYJ4EluY2iBz5+lQ8BbdblxC4IkFR3oGmgMmKdxbs+KVADlW2SzcpJACz13p5bwW6bWb9HMAd9WA38J+NRdN2/qHNE5gYnWoCIXkjYkwfDp7qm37oXQnfSggHSYA6cyKvffBAg3sKwJjURM9PDzqNZxWusmrLEMwnKAdNpifLxqowmFYnMe6vLNufADcmnYD98lWW4N1II+o94JHvrF9r+1h4net8PwyOEN5VvFlgsFeCkclGsnnHruMVERyAqpwfC8JhGu8UuMQcpDLPdLg5ZA5u3dAHUnrUoPmhM2mGt5VA6CKerycflcf8A+0X/ANw/6aZuflfuzphE/wDcb/TV1ipmde2Y2Me77qba0ejfD7qU2m/5g9Sa5Fgidm8/aD+WKrsmbDs/2uwuHsW7V+5kYAj7LMAJMSVBjSK0eB7SYO/pbxNpj0DqG/hOteQvh9TKA6xu3Lzpq9gEca2x6isbhGy3k96SDryqqw2HRbryJdiY8BzPpXiqYe7Z/sLt63HJLjKvorQfSrns12gx634e97SRl/OZM2+yELLHbTXblS9m9RpRYb9qZ6BxDi47yLrBjcQR1B+lV/CWK4m1dkBQxBk8mUg/zVAxl1YZmZpg5llPHXMR4bzzqDgMZdayzQQqdYJykZhrAGvwg11cf8ThSUud35KHqJv8HryPIBFcu9ZnAdq8MltRdvBH2OckyYBJB101qdb49hrn2MRaP76z6EzWOTUW42CVkTtZiWSwCrFR7axnZTBFv2yZzPSND4E0/jMQq/aYKJjUgCffXVwreDIAHDAhgIYEHQg8orz7iXBcZfutbso9y2mVLbuyjKYDAZiQWCyNTOg9a4+9IvxwT7dF5b7Qo+MuYWRpbUowP221NxemmnxqB2g0Q1jOMYLE4O8q3h7FwvcuL3gzLml0Y7gkiY2Dcq5w/EL5t5LlxnZsqopKsSzGBB31OkHrUM0K6JqoS4HuD8Au8Ru+ytnIg1uXTtbU/wCYiYH0r2ThNmxbRbOHIyWgFABnbmSdyetZKzgv6NYXDodBq5H95cI7zHqOQHIAVY8GQqQRvVe/wOUbdmD7U8KNq/cRT3cxK5tyDqPPmPdVAuGbpXpH5T7IyWrwGuYqfeJHxU+teeo+tZZpxbOlimpxTHbGEbpVjircLy86YtXelR+IYvunXfT8eNQgpSLZTSGLvD3vaICx8IAkzAkkCTBgc4pxMM1m2ouoymPskEaSRufKvSuxPBns4JbtxAtzv3YcHMqlYEg7NlHPbMRprWH4lxDEYvEWEtXBYe+EtPYVc9tnd2DsdCfZhGBKnQENHWunhhtVM4+oy75G67GcRF+woJllEEbxqcuvPSD760otsBoTHnWf4B2JXAnu3nYkgTlCqVB2K6nNE6z7q0GKVxHsyNCAQSMsRJJPL/erW0jMJ7a4vOfPX41BNpBd9sLY9pr3pfmIOmaPhVs693UGY2+/pUAsJintT7Cx1cTMkqQTvB0OkTBmPdXSXJI7skbFiSdTO4pvMqiW0EgT5mBUyzbG9P013QtwYhRcIJzacg0AxtOk/GpFs6RGnTX76FSnoApqCTsTYy7ty08vv3qCmIAJMzyk70vGseLFlnMnTYAkmdAABvWLt8fBH2bniSjKPeToKjJjSNRjcYACSa8u45xe/iWy5j7FWYogIAk7sepjmdgfE1M4jx84iUTNl6iGn3zEVBSz3C50WY1W2JPRep6048cskVrK/wCDUG8DOs1c3CB+ivv9n6aCq+6BOyj8eAqyxF3/AFhH93c10/Q9dHrh8bp/ZN71Tl+9TUee8em5/HSm7hnrzPuFVtk0htsRv+bPwB/mo/pOn2T8B5bNXP45elcsB0NZ2uSwdXEA/oEev0NO8Mu5bkrnBiAVMGSRuRrETp4VFMAxT+HESwbpO0xtI0Py51q0WNTzxTIZXUWP47FFyRezm4Ax7vTfKsb6CdemlTeC8Zt2bTWbxe4pEAOQTqDCKAdABEkmddOQpx+LWcSEZl/Oq0sQYyBTlTUjvNIGg/8AMjhwt3bV25jc9tA5YXCMihZAQe0zd5iSe7lP1rvazNHFic2uuODNijulRXr2gey9trMkEQbbjMrDTUiJXWRIPpWlPau0wg2UkjYBTB6GRHTX4VHOCwqICVBuOxK5xDFeRuScug5kctukXD8fwtrEoXtA2dLYIUEseTQIziRufGvFz1jzZPdT/R0/Z6Vm24HiLL2hcsqFDhRcCqFZbiiDmgDr05zzqVg7At3GI0zkuR1YhFJHTYe+TzqH/W9i4hawI2BPs3T3HMomqa9jCW31ifuqOp1voNRStkMeBzvwaDj/AATD43It5CxRswIOUgkbZhrG2m208qwlnsxhsLxRLSMzlLZvkMR3HmABziWRxM6zqdANv2Z4gbqPbZu8h3GrFW1UnSJ3HPaonFrCYe4jpZQLcYrdvsQLpuMVFpSW7zhiMsAmDl0gabN3qY9y+hSltntYxeWTU3AJ4VX3G1qXgr8c6zpl7RUflRcDBoOt5QP4XP0rzO3Wn/K/x9S1nDKZKTceNQCwhFMc4zH3ivOhxIDnVssLlyWYsygqZojdgb1J7LcVt4fH2Lt5gLaswLNqEzW2VX8IYqZ5RPKsjc4nPOvTfyX9kluquNxKE94NZUkxlXUXSBvLbT+rMGRE8eBx5Ys2dSRb9vuLMHREutAQPnRvt5pABywCNDpsc1YC/wAOuFxilv5GUqVKqQbZBle9m018OdaP8pgZsYoQ5gyhSRMJE/a8dSapblwC2IuWy8RBX2bMCD3ZBg6H5Vfig7bsz48al2ekcJ7QX8RgUe6yG5nZGa2IDZYhh0JBExpO0UwmOZSSCwO8ydefPemewfBXPDj7XuZrz3LQ0MIVVRPUGCZ6Qamf1DeYkZl03gz0++uNr9Plnm3R68GnDPHGLiy/4Tif6RbBLkEb5Y1jzBrP8T4nbN5lsySshmJ0kRqN9jPgamYnhtqxhH9qjXLRUs+TvMNJzqCeXhrz61guArYOF9vcvAZCQSuZcsTAuEmMxEEgaAHnNd7RY5SS3eDDkrlo1uExl28y27gYIZBcEQRBOs7EEDxHxqfwniZtK6vftt7NvZ5GBDLGwkco1Bg6V5jgccbt6LWIeGnU5gWAP2ZI2Ogn76n8Otf8VGjZ5LzBVYaIldM0AT5b1057JL7Fax0es4Hi1u87Wg2Vv0ep0n1qww6lVyPB3E9RyPgd/Ss/2Uv3DmRr1syc0BQr5TGqCTIG061B4rxp3uNlJVFLARvAJEn41xNdnWl75LMOJ5XSNfiFm0yqe8yMo1jUrA1Go1ivBu1nYzF4Roul79qQFvEkhmK5jKlmKH7Qk6GN+nqvBOKMzgE5geZ5VI7fg/0F2D5QpRjCe0kBgBpyyyGnllqrT6tZ4OUV14JZMTxumePYHDrh1DXiIOq21Ms/+lPHc8qnXsYLgDbQNFC6BeiidqgqMEzZmvtcY7s4uEk+QCz61zicYikCzkIjf2OUgzsM7MY8ZFXQbfLTv/Csde6uwnyyD76rcReM7eXd/wBjXb459s7DyhflUZsTeO1xv42++rU5fYDRXCu2Y+EA8t9yPxNMPeUzE/wqNuWpqbcw4PpyJGnuOlNNg13nblmn4UmWIhyCeXvgUmsjb4fOnmsLy+P/AJrtWAI6jaIB93/iqWTRHxGHZQCw0Ov6M+m5rgYv2cNJAkAwgJjnpOtS5XUk6+Gvq0E/CoeOtFho3rPPzqeKW2aYpdEY3rcC6jZYJIUxmOUnKY2mSPdNTeJY5btq2VZma33jmWFzEgFgI1kk94jkAd6qf6K3UbEfWu0sNI0OwmAQYBkCQdNQK7D1ybuUTOoUXnZ3srdxdo37164upP5xLh9ouwYMbik84PjWosYfA4Z1tlUy5YLOSc7wGZQ7y2gUmM0a+GmTxvHMXcsrZz5FVQBlDhsoAChmLE6dZ5+AqlvYR7hGeYUDQSAAeQHjuep3rgZMU8uRyk6V9I2Ke2NHrtztNw+9GCw1xGcLKLbHcBBAgMBlLa7CedJjeD3VKiQCxgKzAMQTG3TUV5RhMF7F1uJKujKysIkMCCDVvxTjuKvXlvm5FxQq5kUKWg5hm011qOfSY8rtkceWUOj1Lg3DfYG6rsvtTlMDkkQkbTsfQ159+VDizsFw17CIlxWz28QtzOckwfZ9wMswJBO4G8A1W47jOKu3hea+2dVyAgACJmCsQRPUVE4k74lw95y7QFGwgAkwABA1NaMUFBUiuTcnbJ3B+3bKoTFWmcgCLqRJ/bUxJ8Rv0qRjvyhqqkYay+c6Z7kBVnnlBMms8cIOm+np7q5OFB5c49w91Hpwu6JbnRS4hnuMXeWZmJZjuSeZqObR6davmseWxPlG1NHDnSY1Xx3q5MhRRnDTtFeldjO2hw2DSxcR2yllXJl/sz3l1J3BLCOka6a5BbGnLapVi3GnuobCjrtJxm9ibmYfm1AgIp5HmTGp9NqpsO10HLlzZjG8HXqZGnPf3irm7amY01C8qbbDz03g7fjrQnXQK0zU8V/KUr21tLbZYgRaYFIAAADwNB4DkNa0HZXji239tbYvbbuuDIPUEg65h8ZPnXnJwxjRvgs6eNN4HD3bLl7d5g0Bt5DCZysDoefLmazTxOT3J0yDTNJxP8od7B3b+GsZLtpLh9k7hjlQ6m3AIlVJZRtAHMQKxmAxn9IdbN0OUzHJatZVtqXYs0qdl1OsyAN6t8dhfau1xissMxyiAZG8dffUK5w6DKmCADI0PmCOetbMUqaY2m0bDAdl0uKMi5FBOZhMjSAq9Y3Jo4TaFu8WMg5rm8nKozLladxBHwqmwXG8TaCKWZsrFmYmSQVhAF5jberLiPH1e77REYMAsnQBnkkgjWARAnwJ6T1oZcNWym5rg1vYk28NcWxhQoS6+ZlbW4qgSQhLSLehOx1Ztp0seKcGdXJQFlJ30nUz9TXl+HvOLwvIzIyllUzOQNuBOwqyvdpMdAU4lwFYT9mZDFgSY1E7zoQI2rgfyGDHqH9DTgnLHyeh8L4cyDMRGXTLz8aldqWxD4G6MKxDlOWWTb/TySNysxz6axXl78fxZW2DiXBtsYaYYzH22/THg01xisfcvEk3NyTCDKMxADEAAZc0SwGhOsVTpdNHBGokss3kdsobeGUAab+sipCYUExqesCYOm40+dOaDkT4be+nwSYgN4hYAjrm51sRUcXeHZddF8Jy/AzUJrY8fx7qtnsqNSQD0LZjqJ/R+VQXfXYnyBpgaFt/efrTeI291FFV+CaORufKlxVFFVMmhttqiYzeiinHsT6I3L3H511Y+z+59RRRWhkB1/sn9kU2ftHyX5UUVUS8Ek7HzX5mo9/c+f8AmoopMDlOXnSjdf2vuooqSEA3X9s/KmU2X9s/MUlFAxE/R/YufWoabj/CaiimhA3L9kfM1Kf7Te6iimA1iuf7f0ahPst+2v1oooETbex/eoT9H/CPzaloqIHLfo/4X+am/wD9f3UUVOImMYnZv8NPnXN7+880+VLRVhEl2d7nmvyp29u3u+tFFUy7JoZPPyFd29vx0NFFJDGX3NP4j7A8/pRRU0ROR9R8xT9vaiimB//Z",
  },
  {
    id: 8,
    title: "Hải sản",
    value: "Seafood",
    subTitle: "",
    image_Url: "https://cdn.tgdd.vn/2021/04/CookProduct/13-1200x676.jpg",
  },
  {
    id: 9,
    title: "Gia súc & Gia cầm",
    value: "Livestock",
    subTitle: "",
    image_Url: "https://media.dolenglish.vn/PUBLIC/MEDIA/b6e53e37401dbd43e40c.jpg",
  },
  {
    id: 10,
    title: "Khác",
    value: "Other",
    subTitle: "",
    image_Url: "https://stepup.edu.vn/wp-content/uploads/2020/08/the-other-1.jpg",
  },
];

// product Data
export const productData = [
  {
    id: 1,
    category: "Computers and Laptops",
    name: "MacBook pro M2 chipset 256gb ssd 8gb ram space-gray color with apple 1 year warranty",
    description:
      "Mô tả sản phẩm ví dụ — thông tin tính năng, thông số kỹ thuật và hình ảnh chi tiết.",
    image_Url: [
      {
        public_id: "test",
        url: "https://www.istorebangladesh.com/images/thumbs/0000286_macbook-pro-m1_550.png",
      },
      {
        public_id: "test",
        url: "https://www.istorebangladesh.com/images/thumbs/0000286_macbook-pro-m1_550.png",
      },
    ],
    shop: {
      name: "Apple inc.",
      shop_avatar: {
        public_id: "test",
        url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
      },
      ratings: 4.2,
    },
    price: 1099,
    discount_price: 1049,
    rating: 4,
    total_sell: 35,
    stock: 10,
  },
  {
    id: 2,
    category: "Mobile and Tablets",
    name: "Iphone 14 pro max 256 gb ssd and 8 gb ram silver colour",
    description:
      "Mô tả sản phẩm ví dụ — thông tin tính năng, thông số kỹ thuật và hình ảnh chi tiết.",
    image_Url: [
      {
        public_id: "test",
        url: "https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg",
      },
      {
        public_id: "test",
        url: "https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg",
      },
    ],
    shop: {
      name: "Amazon Ltd",
      shop_avatar: {
        public_id: "test",
        url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
      },
      ratings: 4.2,
    },
    discount_price: 1099,
    rating: 5,
    total_sell: 80,
    stock: 10,
  },
  {
    id: 1,
    category: "Computers and Laptop",
    name: "MacBook pro M2 chipset 256gb ssd 8gb ram space gray color with apple 1 year warranty",
    description:
      "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
    image_Url: [
      {
        public_id: "test",
        url: "https://www.istorebangladesh.com/images/thumbs/0000286_macbook-pro-m1_550.png",
      },
      {
        public_id: "test",
        url: "https://www.istorebangladesh.com/images/thumbs/0000286_macbook-pro-m1_550.png",
      },
    ],
    shop: {
      name: "Apple inc.",
      shop_avatar: {
        public_id: "test",
        url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
      },
      ratings: 4.2,
    },
    price: 1099,
    discount_price: 1049,
    rating: 4,
    total_sell: 75,
    stock: 10,
  },
  {
    id: 4,
    category: "Others",
    name: "New Fashionable Watch for men 2023 with multiple colors",
    description:
      "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
    image_Url: [
      {
        public_id: "test",
        url: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
      },
      {
        public_id: "test",
        url: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
      },
    ],
    shop: {
      name: "Shahriar Watch House",
      shop_avatar: {
        public_id: "test",
        url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
      },
      ratings: 4.2,
      category: "Others",
    },
    price: 100,
    discount_price: 79,
    rating: 4,
    total_sell: 12,
    stock: 10,
  },
  {
    id: 5,
    category: "Shoes",
    name: "New Trend shoes for gents with all sizes",
    description:
      "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
    image_Url: [
      {
        public_id: "test",
        url: "https://mirzacdns3.s3.ap-south-1.amazonaws.com/cache/catalog/RLV0015/2-800x800.jpg",
      },
      {
        public_id: "test",
        url: "https://mirzacdns3.s3.ap-south-1.amazonaws.com/cache/catalog/RLV0015/2-800x800.jpg",
      },
    ],
    shop: {
      name: "Alisha Shoes Mart",
      shop_avatar: {
        public_id: "test",
        url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
      },
      ratings: 4.2,
    },
    price: 120,
    discount_price: 89,
    rating: 5,
    total_sell: 49,
    stock: 10,
  },
  {
    id: 1,
    name: "Gaming Headphone Asus with mutiple color and free delivery",
    description:
      "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
    image_Url: [
      {
        public_id: "test",
        url: "https://www.startech.com.bd/image/cache/catalog/headphone/havit/h763d/h763d-02-500x500.jpg",
      },
      {
        public_id: "test",
        url: "https://eratablet.com/wp-content/uploads/2022/08/H51ba6537405f4948972e293927673546u.jpg",
      },
    ],
    shop: {
      name: "Asus Ltd",
      shop_avatar: {
        public_id: "test",
        url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
      },
      ratings: 4.2,
    },
    price: 300,
    discount_price: 239,
    rating: 4.5,
    reviews: [
      {
        user: {
          // user object will be here
        },
        comment: "IT's so cool!",
        rating: 5,
      },
    ],
    total_sell: 20,
    stock: 10,
    category: "Music and Gaming",
  },
  {
    id: 4,
    name: "New Fashionable Watch for men 2023 with multiple colors",
    description:
      "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
    image_Url: [
      {
        public_id: "test",
        url: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
      },
      {
        public_id: "test",
        url: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
      },
    ],
    shop: {
      name: "Shahriar Watch House",
      shop_avatar: {
        public_id: "test",
        url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
      },
      ratings: 4.2,
    },
    price: 100,
    discount_price: 79,
    rating: 4,
    total_sell: 62,
    stock: 10,
  },
  {
    id: 1,
    name: "Gaming Headphone Asus with mutiple color and free delivery",
    description:
      "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
    image_Url: [
      {
        public_id: "test",
        url: "https://www.startech.com.bd/image/cache/catalog/headphone/havit/h763d/h763d-02-500x500.jpg",
      },
      {
        public_id: "test",
        url: "https://eratablet.com/wp-content/uploads/2022/08/H51ba6537405f4948972e293927673546u.jpg",
      },
    ],
    shop: {
      name: "Asus Ltd",
      shop_avatar: {
        public_id: "test",
        url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
      },
      ratings: 4.2,
    },
    price: 300,
    discount_price: 239,
    rating: 4.5,
    reviews: [
      {
        user: {
          // user object will be here
        },
        comment: "IT's so cool!",
        rating: 5,
      },
    ],
    total_sell: 20,
    stock: 10,
  },
  {
    id: 2,
    category: "Mobile and Tablets",
    name: "Iphone 14 pro max 256 gb ssd and 8 gb ram silver colour",
    description:
      "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
    image_Url: [
      {
        public_id: "test",
        url: "https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg",
      },
      {
        public_id: "test",
        url: "https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg",
      },
    ],
    shop: {
      name: "Amazon Ltd",
      shop_avatar: {
        public_id: "test",
        url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
      },
      ratings: 4.2,
    },
    discount_price: 1099,
    rating: 5,
    total_sell: 20,
    stock: 10,
  },
  {
    id: 1,
    category: "Music and Gaming",
    name: "Gaming Headphone Asus with mutiple color and free delivery",
    description:
      "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
    image_Url: [
      {
        public_id: "test",
        url: "https://www.startech.com.bd/image/cache/catalog/headphone/havit/h763d/h763d-02-500x500.jpg",
      },
      {
        public_id: "test",
        url: "https://eratablet.com/wp-content/uploads/2022/08/H51ba6537405f4948972e293927673546u.jpg",
      },
    ],
    shop: {
      name: "Asus Ltd",
      shop_avatar: {
        public_id: "test",
        url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
      },
      ratings: 4.2,
    },
    price: 300,
    discount_price: 239,
    rating: 4.5,
    reviews: [
      {
        user: {
          // user object will be here
        },
        comment: "IT's so cool!",
        rating: 5,
      },
    ],
    total_sell: 20,
    stock: 10,
  },
];

export const footerProductLinks = [
  {
    name: "Về chúng tôi",
    link: "/about",
  },
  {
    name: "Tuyển dụng",
    link: "/carrers",
  },
  {
    name: "Cửa hàng",
  },
  {
    name: "Blog",
  },
  {
    name: "Đánh giá",
  },
];

export const footercompanyLinks = [
  {
    name: "Game & Video",
  },
  {
    name: "Điện thoại & Máy tính bảng",
  },
  {
    name: "Máy tính & Laptop",
  },
  {
    name: "Đồng hồ thể thao",
  },
  {
    name: "Sự kiện",
  },
];

export const footerSupportLinks = [
  {
    name: "Câu hỏi thường gặp",
  },
  {
    name: "Đánh giá",
  },
  {
    name: "Liên hệ",
  },
  {
    name: "Shipping",
  },
  {
    name: "Live chat",
  },
];
