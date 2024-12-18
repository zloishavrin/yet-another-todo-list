import { 
  Button,
  useDisclosure,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Input,
  Textarea,
  Image,
  Card,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  CardHeader,
  CardBody, 
  Alert,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Form,
  Skeleton
} from "@nextui-org/react";
import styles from "./Main.module.css";
import { Context } from "../../main";
import { FormEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileUploader } from "react-drag-drop-files";
import APIService from "../../utils/api/service";
import { ExitIcon } from "../../Components/ExitIcon";

interface IArticle {
  title: string,
  description: string,
  imageId: string,
  _id: string,
  status: string,
  createdAt: string
}

interface IMe {
  _id: string,
  login: string
}

export const Main = () => {

  const { store } = useContext(Context);
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [ isVisibleAlert, setIsVisibleAlert ] = useState(false);
  const [ alertType, setAlertType ] = useState("");

  const [ image, setImage ] = useState(null);
  const [ newArticleTitle, setNewArticleTitle ] = useState("");
  const [ newArticleDescription, setNewArticleDescription ] = useState("");

  const [ articles, setArticles ] = useState<IArticle[]>([]);
  const [ me, setMe ] = useState<IMe | null>(null);

  useEffect(() => {
    const getArticles = async () => {
      const responce = await APIService.getAllArticles();
      setArticles(responce.data);
    }

    const getMe = async () => {
      const responce = await APIService.getMe();
      setMe(responce.data);
    }

    getArticles();
    getMe();
  }, []);

  const createNewArticle = async () => {
    try {
      if(image) {
        const responce = await APIService.addArticleWithImage(newArticleTitle, newArticleDescription, image);
        const newArticles = [responce.data, ...articles];
        setArticles(newArticles);
      }
      else {
        const responce = await APIService.addArticleWithoutImage(newArticleTitle, newArticleDescription);
        const newArticles = [responce.data, ...articles];
        setArticles(newArticles);
      }
      openAlert("create");
    }
    catch(error) {
      console.log(error);
    }
    finally {
      setNewArticleTitle("");
      setNewArticleDescription("");
      setImage(null);
    }
  }

  const handleFileChange = async (file: File) => {
    try {
      const responce = await APIService.uploadFile(file);
      setImage(responce.data.imageId);
    }
    catch(error) {
      console.error(error);
    }
  }

  const logout = () => {
    store.logout();
    navigate("/login");
  }

  const deleteArticle = async (id: string) => {
    try {
      await APIService.deleteArticle(id);
      const newArticles = articles.filter((article) => article._id !== id);
      setArticles(newArticles);
      openAlert("delete");
    }
    catch(error) {
      console.error(error);
    }
  }

  const changeArticle = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(e.currentTarget instanceof HTMLFormElement) {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(
          Array.from(formData.entries()).map(([key, value]) => [key, value.toString()])
      );
      try {
        await APIService.changeArticle(data.id, data.title, data.description);
        const newArticles = articles.map((article) => {
          if(article._id === data.id) {
            article.title = data.title;
            article.description = data.description;
          }
          return article;
        });
        setArticles(newArticles);
        openAlert("change");
      }
      catch(error) {
        console.error(error);
      }
    }
  }

  const completeArticle = async (id: string) => {
    try {
      await APIService.completeArticle(id);
      const newArticles = articles.map((article) => {
        if(article._id === id) {
          article.status = "completed";
        }
        return article;
      });
      setArticles(newArticles);
      openAlert("complete");
    }
    catch(error) {
      console.error(error);
    }
  }

  const openAlert = (type: string) => {
    setAlertType(type);
    setIsVisibleAlert(true);
    setTimeout(() => setIsVisibleAlert(false), 3000);
  }

  return (
    <div className={styles.MainContainer}>

      <div className={styles.AlertContainer}>
        <Alert
          color={
            alertType === "delete" ? "danger" :
            alertType === "complete" ? "success" :
            alertType === "create" ? "primary"
            : "secondary"
          }
          title={
            alertType === "delete" ? "Задача удалена" :
            alertType=== "complete" ? "Задача выполнена" :
            alertType === "create" ? "Задача успешно создана" 
            : "Задача успешно изменена"
          }
          isVisible={isVisibleAlert}
          onClose={() => setIsVisibleAlert(false)}
          variant="faded"
        />
      </div>

      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          wrapper: styles.Modal,
          backdrop: styles.Modal
        }}
        size="lg"
        backdrop="blur"
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">Новая задача</DrawerHeader>
              <DrawerBody>
                <div className="flex flex-col gap-4 w-full">
                  <Input 
                    isRequired
                    label="Название"
                    labelPlacement="outside"
                    name="title"
                    validationBehavior="native"
                    minLength={5}
                    maxLength={64}
                    description="От 5 до 64 символов"
                    variant="faded"
                    value={newArticleTitle}
                    onChange={(e) => setNewArticleTitle(e.currentTarget.value)}
                  />
                  <Textarea 
                    isRequired
                    label="Описание"
                    minLength={5}
                    maxLength={256}
                    validationBehavior="native"
                    labelPlacement="outside"
                    name="description"
                    description="От 5 до 256 символов"
                    variant="faded"
                    value={newArticleDescription}
                    onChange={(e) => setNewArticleDescription(e.currentTarget.value)}
                  />
                  {
                    !image ? (
                      <FileUploader
                        handleChange={handleFileChange}
                        name="file"
                        types={["JPG", "PNG", "GIF", "SVG", "JPEG"]}
                        label="Загрузите изображение"
                        required={false}
                        hoverTitle="Загрузить изображение"
                      >
                        <div className={styles.FileUploader}>

                        </div>
                      </FileUploader> 
                      ) : (
                      <Image
                        alt="Загруженное изображение"
                        src={`http://localhost/storage/${image}`}
                      />
                    )
                  }
                </div>
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Закрыть
                </Button>
                <Button color="primary" onPress={() => {
                  createNewArticle();
                  onClose();
                }}>
                  Добавить
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
      <div className={styles.Main}>
        <div className={styles.Header}>
          <Skeleton
            isLoaded={me !== null}
          >
            <h2>
              {me && me.login}
            </h2>
          </Skeleton>
          <Button
            color="danger"
            variant="flat"
            onPress={logout}
            isIconOnly
          >
            <div className={styles.SVGContainer}>
              <ExitIcon />
            </div>
          </Button>
        </div>
        <div className={styles.ArticleContainer}>
          <Card
            classNames={{
              base: styles.Card,
              body: styles.CardBodyAdd
            }}
            isHoverable
            isBlurred
            shadow="sm"
          >
            <CardBody
              onClick={onOpen}
            >
              +
            </CardBody>
          </Card>
          {articles.map((article) => (
            <Dropdown
              key={article._id}
            >
              <DropdownTrigger>
                <Card
                  classNames={{
                    base: styles.Card,
                    body: styles.CardBody
                  }}
                  shadow="lg"
                  isHoverable
                >
                  <CardHeader className={styles.CardHeader}>
                    <p className={styles.CardHeaderTitle}>{article.title}</p>
                    <p className={styles.CardHeaderStatus + " " + (
                      article.status === 'in-progress' ? styles.primaryColor : styles.successColor
                    )}>
                      {article.status === 'in-progress' ? 'В процессе' : 'Выполнено'}
                    </p>
                  </CardHeader>
                  <CardBody>
                    {article.imageId ?
                      <Image
                        className={styles.CardImage}
                        src={`http://localhost/storage/${article.imageId}`}
                      /> :
                      <p>{article.description}</p>
                    }
                  </CardBody>
                </Card>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  key={`open_${article._id}`}
                  color="primary"
                  closeOnSelect={false}
                >
                  <Popover
                    placement="top-start"
                    showArrow={false}
                    backdrop="blur"
                  >
                    <PopoverTrigger>
                      <p>Открыть</p>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className={styles.ArticleElementContainer}>
                        <p className={styles.ArticleTitle}>{article.title}</p>
                        <p className={styles.ArticleStatus + " " + (
                          article.status === 'in-progress' ? styles.primaryColor : styles.successColor
                        )}>
                          {article.status === 'in-progress' ? 'В процессе' : 'Выполнено'}
                        </p>
                        <p className={styles.ArticleDate}>Создана: {new Date(article.createdAt).toLocaleDateString()}</p>
                        <p className={styles.ArticleDescription}>{article.description}</p>
                        {article.imageId ?
                          <Image
                            className={styles.ArticleImage}
                            src={`http://localhost/storage/${article.imageId}`}
                          /> : null
                        }
                      </div>
                    </PopoverContent>
                  </Popover>
                </DropdownItem>
                {
                  article.status === 'in-progress' ? (
                    <DropdownItem
                      key={`done_${article._id}`}
                      description="Отметить задачу выполненной"
                      onPress={() => completeArticle(article._id)}
                      color="success"
                    >
                      Выполнено
                    </DropdownItem>
                  ) : null

                }
                <DropdownItem
                  key={"edit"}
                  color="secondary"
                  closeOnSelect={false}
                >
                  <Popover
                    placement="top-start"
                    showArrow={false}
                    backdrop="opaque"
                  >
                    <PopoverTrigger>
                      <p>Изменить</p>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className={styles.ArticleElementContainer}>
                        <Form
                          validationBehavior="native"
                          onSubmit={changeArticle}
                        >
                          <Input 
                            label="Название"
                            defaultValue={article.title}
                            variant="bordered"
                            minLength={5}
                            maxLength={64}
                            description="От 5 до 64 символов"
                            validationBehavior="native"
                            labelPlacement="outside"
                            name="title"
                          />
                          <Textarea
                            label="Описание"
                            defaultValue={article.description}
                            variant="bordered"
                            minLength={5}
                            maxLength={256}
                            description="От 5 до 256 символов"
                            validationBehavior="native"
                            labelPlacement="outside"
                            name="description"
                          />
                          <Input 
                            type="hidden"
                            value={article._id}
                            name="id"
                          />
                          <div className="flex gap-4">
                            <Button
                              variant="solid"
                              type="submit"
                              color="secondary"
                            >
                              Сохранить
                            </Button>
                            <Button
                              variant="bordered"
                              type="reset"
                              color="danger"
                            >
                              Сброс
                            </Button>
                          </div>
                        </Form>
                      </div>
                    </PopoverContent>
                  </Popover>
                </DropdownItem>
                <DropdownItem
                  key={`delete_${article._id}`}
                  description="Удалить задачу"
                  color="danger"
                  onPress={() => deleteArticle(article._id)}
                >
                  Удалить
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ))}
        </div>
      </div>
    </div>
  )

}