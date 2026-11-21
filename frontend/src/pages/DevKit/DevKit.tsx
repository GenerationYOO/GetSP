import "./DevKit.css"
import { ActionButton } from "../../components/ActionButton/ActionButton"
import { AuthSwitch } from "../../components/AuthSwitch/AuthSwitch"
import { Checkbox } from "../../components/Checkbox/Checkbox"
import { InputForm } from "../../components/InputForm/InputForm"
import { Header } from "../../components/Header/Header"
import { FormContainer } from "../../components/FormContainer/FormContainer"
import { HomePageButton } from "../../components/HomePageButton/HomePageButton"
import { PageLayout } from "../../components/PageLayout/PageLayout"
import { SpreadsheetUploader } from "../../components/SpreadsheetUploader/SpreadsheetUploader"
import { SurfaceCard } from "../../components/SurfaceCard/SurfaceCard"
import { TaskPreviewBlock } from "../../components/TaskPreviewBlock/TaskPreviewBlock"
import { TaskTable } from "../../components/TaskTable/TaskTable"
import { TaskTags } from "../../components/TaskTags/TaskTags"
import { ThemeToggle } from "../../components/ThemeToggle/ThemeToggle"
import { UploadButton } from "../../components/UploadButton/UploadButton"
import eyeIcon from "../../assets/icons/eye.svg"
import createSessionIcon from "../../assets/icons/createSession.svg"
import { useState } from "react"

export function DevKit() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const demoTasks = [
    {
      id: "TSK-101",
      priority: "Обычная",
      title: "Настроить DevKit",
      description: "Добавить демонстрацию всех общих компонентов.",
      tags: ["Frontend", "UI"],
    },
  ]

  return (
    <main className="devkit">
      <section className="devkitSection">
        <h2 className="devkitSectionTitle">Buttons</h2>

        <div className="devkitGrid">
          <article className="devkitCard">
            <h3 className="devkitCardTitle">AuthButton</h3>
            <ActionButton text="AuthButton" onClick={() => { }} />
          </article>

          <article className="devkitCard">
            <h3 className="devkitCardTitle">AuthSwitch</h3>
            <AuthSwitch
              text="AuthSwitch"
              onClick={() => { }} />
          </article>

          <article className="devkitCard">
            <h3 className="devkitCardTitle">HomePageButton</h3>
            <HomePageButton
              leftIcon={createSessionIcon}
              title="Создать сессию"
              description="Начать новую работу"
              onClick={() => { }}
            />
          </article>

          <article className="devkitCard">
            <h3 className="devkitCardTitle">UploadButton</h3>
            <UploadButton
              title="Выберите файл"
              onFileSelect={setUploadedFile}
            />
            {uploadedFile && (
              <p className="devkitCaption">Выбран: {uploadedFile.name}</p>
            )}
          </article>

          <article className="devkitCard">
            <h3 className="devkitCardTitle">ThemeToggle</h3>
            <ThemeToggle />
          </article>
        </div>
      </section>

      <section className="devkitSection">
        <h2 className="devkitSectionTitle">Form controls</h2>

        <div className="devkitGrid">
          <article className="devkitCard">
            <h3 className="devkitCardTitle">Checkbox</h3>
            <Checkbox />
          </article>

          <article className="devkitCard">
            <h3 className="devkitCardTitle">InputRegisterForm</h3>
            <InputForm
              title="InputRegisterForm"
              type="text"
              placeholder="Placeholder"
              leftIcon={eyeIcon}
              description="Description"
              error="Error"
            />
          </article>
        </div>
      </section>

      <section className="devkitSection">
        <h2 className="devkitSectionTitle">Navigation</h2>

        <article className="devkitCard devkitCardWide">
          <h3 className="devkitCardTitle">Header</h3>
          <div className="devkitHeaderPreview">
            <Header />
          </div>
        </article>
      </section>

      <section className="devkitSection">
        <h2 className="devkitSectionTitle">Layouts</h2>

        <div className="devkitGrid">
          <article className="devkitCard">
            <h3 className="devkitCardTitle">PageLayout</h3>
            <PageLayout className="devkitPageLayoutPreview">
              <SurfaceCard className="devkitSurfaceCardPreview">
                Содержимое страницы
              </SurfaceCard>
            </PageLayout>
          </article>

          <article className="devkitCard">
            <h3 className="devkitCardTitle">FormContainer</h3>
            <FormContainer
              className="devkitFormContainerPreview"
              onSubmit={(event) => event.preventDefault()}
            >
              <InputForm
                title="Название"
                type="text"
                placeholder="Введите значение"
                leftIcon={eyeIcon}
              />
              <ActionButton text="Сохранить" onClick={() => { }} />
            </FormContainer>
          </article>

          <article className="devkitCard">
            <h3 className="devkitCardTitle">SurfaceCard</h3>
            <SurfaceCard className="devkitSurfaceCardPreview">
              Поверхность с содержимым
            </SurfaceCard>
          </article>
        </div>
      </section>

      <section className="devkitSection">
        <h2 className="devkitSectionTitle">Upload</h2>

        <article className="devkitCard devkitCardWide">
          <h3 className="devkitCardTitle">SpreadsheetUploader</h3>
          <SpreadsheetUploader
            title="Загрузите таблицу"
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            onFileSelect={setSelectedFile}
          />
        </article>
      </section>

      <section className="devkitSection">
        <h2 className="devkitSectionTitle">Tasks</h2>

        <div className="devkitGrid">
          <article className="devkitCard">
            <h3 className="devkitCardTitle">TaskPreviewBlock</h3>
            <TaskPreviewBlock
              id="TSK-101"
              priority="Обычная"
              title="Настроить DevKit"
              description="Добавить демонстрацию общих компонентов."
              tags={["Frontend", "UI"]}
            />
          </article>

          <article className="devkitCard">
            <h3 className="devkitCardTitle">TaskTags</h3>
            <TaskTags tags={["Frontend", "UI", "Components"]} />
          </article>
        </div>

        <article className="devkitCard devkitCardWide devkitTaskTableCard">
          <h3 className="devkitCardTitle">TaskTable</h3>
          <TaskTable tasks={demoTasks} />
        </article>
      </section>
    </main>
  )
}