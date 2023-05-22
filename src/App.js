import React, { useEffect, useCallback, useState } from "react";
import { ApiImg } from "./components/fetch";
import { ImageGallery } from "./components/list/listItem";
import { BtnLoadMore } from "./components/btnLoadMore/load";
import css from "./app.module.css";
import { Searchbar } from "./components/search/search";
import { Modal } from "components/modal";
import { Loader } from "components/loader/loader";
function App() {
  const [fetchImg, setFetchImg] = useState([]);
  const [countPage, setCountPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [search, setSearch] = useState("");
  const [imgModal, setImgModal] = useState("");

  const hendlerSearch = (e) => {
    e.preventDefault();
    const { value } = e.target[1];
    if (value !== search) {
      setSearch(value.toLowerCase());
      setFetchImg([]);
      setCountPage(1);
    }
  };
  const takeImg = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ApiImg.fetchImgWithQuery(search, countPage);
      setTimeout(() => {
        setFetchImg((prevFetchImg) => prevFetchImg.concat(data));
      }, 500);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [search, countPage]);

  useEffect(() => {
    if (!search) {
      return;
    }

    takeImg();
  }, [countPage, search, takeImg]);
  useEffect(() => {
    const handlerKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsHidden(false);
      }
    };

    document.addEventListener("keydown", handlerKeyDown);

    return () => {
      document.removeEventListener("keydown", handlerKeyDown);
    };
  }, []);

  const hendlerIncrement = () => {
    setCountPage(countPage + 1);
  };
  {
    const closeModal = (e) => {
      if (e.target === e.currentTarget) {
        setIsHidden(false);
      }
    };
    const openModal = (img) => {
      setIsHidden(true);
      setImgModal(img);
    };

    return (
      <div className={css.container}>
        <Searchbar hendlerSearch={hendlerSearch} />
        <ImageGallery fetchImg={fetchImg} openModal={openModal} />
        {isHidden && (
          <Modal img={imgModal} isHidden={isHidden} closeModal={closeModal} />
        )}
        <Loader loading={loading} />
        {fetchImg.length > 0 && !loading && (
          <BtnLoadMore
            hendlerIncrement={hendlerIncrement}
            fetchImg={fetchImg}
          />
        )}
      </div>
    );
  }
}
export { App };
