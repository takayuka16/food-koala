import styles from '../../styles/Shop.module.css';
import Header from 'components/header';
import Footer from 'components/footer';
import Head from 'next/head';
import Image from 'next/image';
import { Shop, GetStaticProps, ShopProps, Menu } from 'types/shops';
import score from 'components/shop/score';
import { useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';

//お店情報の取得
export async function getStaticPaths() {
  const res = await fetch('http://127.0.0.1:8000/shops');
  const shops = await res.json();
  const paths = shops.map((shop: Shop) => ({
    params: {
      id: `${shop.id}`,
    },
  }));
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: GetStaticProps) {
  const res = await fetch(
    `http://127.0.0.1:8000/shops?id=eq.${params.id}`
  );
  const shopData = await res.json();
  return {
    props: { shopData },
  };
}

//fetcher
const fetcher = (resource: string, init: object) =>
  fetch(resource, init).then((res) => res.json());

//メニュー情報の取得
export function MenuList({ data }: { data: Menu[] }) {
  return (
    <>
      {data.map((menu: Menu) => (
        <div key={menu.id}>
          <div className={styles.shop_detail_menuImg}>
            <Image
              src={menu.image_url}
              alt="メニュー画像"
              width={150}
              height={150}
            />
          </div>
          <div className={styles.shop_detail_menuName}>
            <p>{menu.name}</p>
          </div>
          <div className={styles.shop_detail_menuPrice}>
            <p>{menu.price}円</p>
          </div>
        </div>
      ))}
    </>
  );
}

export function ShopMenu({ shopId }: { shopId: number }) {
  const { data, error } = useSWR(
    `http://localhost:8000/items?shop_id=eq.${shopId}`,
    fetcher
  );

  if (error) return <div>エラーです</div>;
  if (!data) return <div>データを取得できませんでした</div>;

  console.log('data', data);
  console.log('shopId', shopId);
  return (
    <>
      <div className={styles.shop_menu}>
        <MenuList data={data} />
      </div>
    </>
  );
}
/*
//レビューの取得
export function ShopReview({ shopData }: ShopProps) {
  const router = useRouter();
  const { id } = router.query;
  return (
    <>
      <div className={styles.shop_detail_reviewTitle}>
        <p>みんなのレビュー</p>
      </div>
      <div className={styles.shop_review}>
        <div className={styles.shop_detail_reviewImg}>
          <img src="/images/provisional_logo.png" alt="コアラ" />
        </div>
        <div className={styles.shop_detail_review}>
          {shopData[Number(id)].review_1}
        </div>
        <div className={styles.shop_detail_reviewImg}>
          <img src="/images/provisional_logo.png" alt="コアラ" />
        </div>
        <div className={styles.shop_detail_review}>
          {shopData[Number(id)].review_2}
        </div>
        <div className={styles.shop_detail_reviewImg}>
          <img src="/images/provisional_logo.png" alt="コアラ" />
        </div>
        <div className={styles.shop_detail_review}>
          {shopData[Number(id)].review_3}
        </div>
      </div>
    </>
  );
}
*/
//全体
export default function ShopDetail({ shopData }: ShopProps) {
  const shop = shopData[0];

  //クリックでお気に入りボタンを赤に
  const [active, setActive] = useState(false);
  function classToggle() {
    setActive(!active);
  }

  return (
    <>
      <Head>
        <title>ショップ詳細画面</title>
        <script
          src="https://kit.fontawesome.com/acecca202b.js"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <main>
        <Header />
        <div>
          <div key={shop.id}>
            <p className={styles.shop_detail_name}>{shop.name}</p>
            <div className={styles.shop_detail_grade}>
              {shop.score}
              {score(shop.score)}
            </div>
            <div className={styles.shop_detail_img}>
              <Image
                src={shop.image_url}
                alt="お店の画像"
                width={150}
                height={150}
              />
            </div>
            <div
              className={
                active
                  ? styles.shop_favorite_true
                  : styles.shop_favorite_false
              }
            >
              <button type="submit" onClick={classToggle}>
                <i className="fa-solid fa-heart"></i>
              </button>
            </div>
            <p>{shop.description}</p>
          </div>
          <div className={styles.shopDetail_menu}>
            <ShopMenu shopId={shop.id} />
          </div>
          <div className={styles.shopDetail_review}>
            <div className={styles.shop_detail_reviewTitle}>
              <p>みんなのレビュー</p>
            </div>
            <div className={styles.shop_review}>
              <div className={styles.shop_detail_reviewImg}>
                <img
                  src="/images/provisional_logo.png"
                  alt="コアラ"
                />
              </div>
              <div className={styles.shop_detail_review}>
                {shop.review_1}
              </div>
            </div>
            <div className={styles.shop_review}>
              <div className={styles.shop_detail_reviewImg}>
                <img
                  src="/images/provisional_logo.png"
                  alt="コアラ"
                />
              </div>
              <div className={styles.shop_detail_review}>
                {shop.review_2}
              </div>
            </div>
            <div className={styles.shop_review}>
              <div className={styles.shop_detail_reviewImg}>
                <img
                  src="/images/provisional_logo.png"
                  alt="コアラ"
                />
              </div>
              <div className={styles.shop_detail_review}>
                {shop.review_3}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
