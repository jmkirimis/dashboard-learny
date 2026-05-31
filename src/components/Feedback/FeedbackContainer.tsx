"use client";

import { useApi } from "@/hooks/useApi";
import BtnAction from "./BtnAction";
import ScoreCard from "./ScoreCard";
import { useUser } from "@/contexts/UserContext";
import { useEffect, useRef, useState } from "react";
import { useCustomAlert } from "@/contexts/AlertContext";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { createPortal } from "react-dom";

type Props = {
  phaseNumber: number;
  phaseCode: string;
  time: string;
  points: number;
  percentage: number;
};

type NotificationModalProps = {
  open: boolean;
  description: string;
  onChangeDescription: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
};

const NotificationModal = ({
  open,
  description,
  onChangeDescription,
  onClose,
  onConfirm,
}: NotificationModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-96 rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-2 text-lg font-semibold text-zinc-700">
          Enviar notificação
        </h2>

        <span className="mb-4 block text-sm text-zinc-500">
          Tipo: Comentário
        </span>

        <textarea
          value={description}
          onChange={(e) => onChangeDescription(e.target.value)}
          placeholder="Digite uma mensagem..."
          className="
            min-h-[120px]
            w-full
            resize-none
            rounded-xl
            border
            border-zinc-300
            p-3
            outline-none
            focus:border-[#6CD2FF]
          "
        />

        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="
              rounded-lg
              border
              border-zinc-300
              px-4
              py-2
              text-zinc-700
              transition
              hover:bg-zinc-100
              hover:cursor-pointer
            "
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="
              rounded-lg
              bg-[#80D25B]
              px-4
              py-2
              text-white
              transition
              hover:opacity-90
              hover:cursor-pointer
            "
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default function FeedbackContainer({
  phaseNumber,
  phaseCode,
  time,
  points,
  percentage,
}: Props) {
  const { request } = useApi();
  const { child } = useUser();
  const { showAlert } = useCustomAlert();

  const [showModal, setShowModal] = useState(false);

  const [type, setType] = useState("");
  const [description, setDescription] = useState("");

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);

  const pickerRef = useRef<HTMLDivElement>(null);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setSelectedEmojis((prev) => [...prev, emojiData.emoji]);
    setShowEmojiPicker(false);
  };

  const openNotificationModal = async (notificationType: string) => {
    if (notificationType === "positive") {
      return;
    }

    if (notificationType !== "comment") {
      let autoDescription = "";

      if (notificationType === "love") {
        autoDescription = "Parabéns filho, continue assim. Amo você";
      }

      const result = await request({
        endpoint: `/api/parents/child/${child?._id}/notifications`,
        method: "POST",
        body: {
          type: notificationType,
          description: autoDescription,
          phaseCode,
        },
      });

      if (result && !result.error) {
        showAlert({
          icon: "/icons/success.png",
          title: "Notificação enviada com sucesso!",
          message:
            result.message || "Sua notificação foi registrada com sucesso",
        });
      } else {
        showAlert({
          icon: "/icons/error.png",
          title: "Erro ao enviar notificação!",
          message: result?.message || "Ocorreu um erro ao enviar a notificação",
        });
      }

      return;
    }

    setType(notificationType);
    setDescription("");
    setShowModal(true);
  };

  const closeNotificationModal = () => {
    setShowModal(false);
  };

  const handleSendNotification = async () => {
    const result = await request({
      endpoint: `/api/parents/child/${child?._id}/notifications`,
      method: "POST",
      body: {
        type,
        description,
        phaseCode,
      },
    });

    if (result && !result.error) {
      showAlert({
        icon: "/icons/success.png",
        title: "Notificação enviada com sucesso!",
        message: result.message || "Sua notificação foi registrada com sucesso",
      });

      closeNotificationModal();
    } else {
      showAlert({
        icon: "/icons/error.png",
        title: "Erro ao enviar notificação!",
        message: result?.message || "Ocorreu um erro ao enviar a notificação",
      });
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    }

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <>
      <NotificationModal
        open={showModal}
        description={description}
        onChangeDescription={setDescription}
        onClose={closeNotificationModal}
        onConfirm={handleSendNotification}
      />

      <div
        className="
          shrink-0
          flex
          flex-col
          rounded-xl
          bg-white
          shadow-[0_0_6px_rgba(150,150,150,0.6)]
        "
      >
        {/* HEADER */}
        <div className="flex h-12 items-center justify-between rounded-t-xl bg-[url('/images/bg-dino.webp')] bg-cover bg-no-repeat px-6">
          <span className="text-xl font-bold text-white">
            {`Fase ${phaseNumber}`}
          </span>
          <div className="flex gap-1 flex-wrap mt-8">
            {selectedEmojis.map((emoji, index) => (
              <div
                key={index}
                className="
                  flex items-center justify-center
                  rounded-full bg-white
                  w-9 h-9
                  shadow-[0_0_3px_rgba(0,0,0,0.8)]
                "
              >
                <span className="text-lg">{emoji}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col px-6 py-8 gap-3">
          {/* SCORES */}
          <div className="flex items-start justify-center gap-4">
            <ScoreCard
              color="#FFB300"
              label="Tempo"
              value={time}
              icon="clock.png"
            />

            <ScoreCard
              color="#80D25B"
              label="Pontos"
              value={points.toString()}
              icon="search.png"
            />

            <ScoreCard
              color="#6CD2FF"
              label="Acertos"
              value={`${percentage}%`}
              icon="percentage.png"
            />
          </div>

          <hr className="mt-4 mb-2 border-zinc-300" />

          {/* ACTIONS */}
          <div className="flex items-center justify-center gap-6">
            <div className="relative">
              <BtnAction
                icon="happy-emoji.png"
                onPress={() => setShowEmojiPicker((prev) => !prev)}
              />

              {showEmojiPicker &&
                createPortal(
                  <div
                    ref={pickerRef}
                    className="
                      fixed
                      z-999999
                      left-1/2
                      top-1/2
                      -translate-x-1/2
                      -translate-y-1/2
                    "
                  >
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>,
                  document.body,
                )}
            </div>

            <BtnAction
              icon="comment.png"
              onPress={() => openNotificationModal("comment")}
            />

            <BtnAction
              icon="heart.png"
              onPress={() => openNotificationModal("love")}
            />
          </div>
        </div>
      </div>
    </>
  );
}
