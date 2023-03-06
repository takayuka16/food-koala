import styles from '../../styles/Shop.module.css';
import { Shop } from 'types/shops';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function FavoriteButton({ shop }: { shop: Shop }) {
  const [heart, setHeart] = useState('shop_favorite_false');
  const userId = Cookies.get('user_id');
  //ページ遷移時にログイン前の場合はお気に入りボタンをグレーに。ログイン後の場合はshop_idとuser_idが一致するデータがfavoriteテーブルに存在するか確認してCSSを切り替え。
  useEffect((): any => {
    if (userId === undefined || userId === null) {
      setHeart('shop_favorite_false');
    } else {
      fetch(
        `http://localhost:8000/favorite?shop_id=eq.${shop.id}&user_id=eq.${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.length === 0) {
            setHeart('shop_favorite_false');
          } else {
            setHeart('shop_favorite_true');
          }
        });
    }
  }, []);

  //ログイン前はonClickでボタンのCSSを切り替え。ログイン後はcheckFavoriteを呼び出し
  function handleClick() {
    if (userId === undefined || userId === null) {
      if (heart === 'shop_favorite_true') {
        setHeart('shop_favorite_false');
      } else if (heart === 'shop_favorite_false') {
        console.log('false');
        setHeart('shop_favorite_true');
      }
    } else {
      checkFavorite();
    }
  }

  //shop_idとuser_idが一致するデータがfavoriteテーブルに存在するか確認。→POSTかDELETE
  function checkFavorite() {
    fetch(
      `http://localhost:8000/favorite?shop_id=eq.${shop.id}&user_id=eq.${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 0) {
          postFavorite();
        } else {
          deleteFavorite();
        }
      });
  }

  //favoriteテーブルに登録（shop_id&user_id)してボタンのCSSをsetHeart
  function postFavorite() {
    fetch(`/api/favorite_post?shop_id=eq.${shop.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shop_id: shop.id,
        user_id: userId,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setHeart('shop_favorite_true');
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  //favoriteテーブルから削除（shop_id&user_id)してボタンのCSSをsetHeart
  function deleteFavorite() {
    fetch(`/api/favorite_delete?shop_id=eq.${shop.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setHeart('shop_favorite_false');
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  //ハートボタンの表示
  return (
    <>
      <div className={styles[heart]}>
        <button type="button" onClick={handleClick}>
          <i className="fa-solid fa-heart"></i>
        </button>
      </div>
    </>
  );
}

//favoriteテーブルで全userのshopのお気に入りを管理。userがshopをお気に入りにしているかチェック※dataが取れてきたらお気に入りと登録済み。
// export function checkFavorite() {
//   fetch(`/api/favorite`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       if (data.length === 0) {
//         postFavorite();
//       } else {
//         deleteFavorite();
//       }
//     });
// }

//onClickでお気に入りを記録するfetch→api/favorite_post
// export function postFavorite() {
//   fetch(`/api/favorite_post`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       user_id: userId,
//     }),
//   })
//     .then((response) => {
//       if (response.ok) {
//         handleClick();
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// }

//onClickでお気に入りを削除するfetch→api/favorite_delete
// export function deleteFavorite() {
//   fetch(`/api/favorite_delete`, {
//     method: 'DELETE',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       user_id: Cookies.get('user_id'),
//     }),
//   })
//     .then((response) => {
//       if (response.ok) {
//         handleClick();
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// }

//お気に入りボタンセット
// export function setFavorite() {
//   return (
//     <div className={styles.shop_favorite_true}>
//       <button type="button" onClick={handleClick}>
//         <i className="fa-solid fa-heart"></i>
//       </button>
//     </div>
//   );
// }

//お気に入りボタン解除
// export function setNoFavorite() {
//   return (
//     <div className={styles.shop_favorite_false}>
//       <button type="button" onClick={handleClick}>
//         <i className="fa-solid fa-heart"></i>
//       </button>
//     </div>
//   );
// }

// import styles from '../../styles/Shop.module.css';
// import { Shop } from 'types/shops';
// import { useEffect, useState } from 'react';

// export default function FavoriteButton({
//   shop,
// }: {
//   shop: { id: number; favorite: boolean };
// }) {
//   const [favorite, setFavorite] = useState(shop.favorite);
//   console.log('shop.favorite', shop.favorite);

//   function handleClick() {
//     fetch(`/api/favorite?shop_id=eq.${shop.id}`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         favorite: !favorite,
//       }),
//     })
//       .then((response) => {
//         if (response.ok) {
//           setFavorite(!favorite);
//         }
//       })
//       .catch((err) => {
//         console.error(err);
//       });
//   }
//if (favorite? setHeart('shop_favorite_true'): setHeart('shop_favorite_false'))
//   return (
// <>
//     <div className={styles.heart}>
//       <button type="button" onClick={handleClick}>
//         <i className="fa-solid fa-heart"></i>
//       </button>
//     </div>
// </>
//   );
// }
