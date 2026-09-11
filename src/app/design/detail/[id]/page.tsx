"use client";
import { DesignCard } from "@/components/design/DesignCard";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  MessageSquareText,
  PencilRuler,
  Share2,
  Star,
  ThumbsUp,
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@base-ui/react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import {VariableSizeGrid as Grid} from "react-window";
// type User = z.infer<typeof Schema>;
const cards = [
  {
    id: 1,
    title: "大师联赛，踢出传奇 I 足球游戏矢量插画",
    description:
      "从1996年起，PES联合建队开始，他们长期征战于乙级联赛，玩家需要操控他们征战联赛，升级到甲级并夺取联赛冠军。大家所看到的，正是当年自己操纵摇杆指挥的这批经典球员，每名球员都耳熟能详，他们都有各自的特点，承载着很多玩家最初的青春回忆......",
    imageUrl: "https://images.dog.ceo/breeds/pembroke/n02113023_2971.jpg",
    badges: ["Badge 1", "Badge 2"],
    updatedAt: "2021-01-01",
    actions: {
      like: {
        count: 10,
        active: false,
      },
      star: {
        count: 20,
        active: false,
      },
      share: {
        count: 30,
        active: false,
      },
    },
  },
  {
    id: 2,
    title: "《Dream Car | 懂车的人，永远不会孤单》",
    description:
      "12岁的Jack总因为喜欢汽车被三个伙伴嘲笑。一次被欺负后，他独自走进爷爷尘封多年的停车间，意外发现一辆留给他的古老大众汽车。",
    imageUrl: "https://images.dog.ceo/breeds/pembroke/n02113023_4898.jpg",
    badges: ["Badge 1", "Badge 2"],
    updatedAt: "2021-01-01",
    actions: {
      like: {
        count: 10,
        active: false,
      },
      star: {
        count: 20,
        active: true,
      },
      share: {
        count: 30,
        active: false,
      },
    },
  },
  {
    id: 3,
    title: "潮流插画/矢量插画合集",
    description: "This is card 3",
    imageUrl: "https://images.dog.ceo/breeds/pembroke/n02113023_6801.jpg",
    badges: ["Badge 1", "Badge 2"],
    updatedAt: "2021-01-01",
    actions: {
      like: {
        count: 10,
        active: false,
      },
      star: {
        count: 20,
        active: false,
      },
      share: {
        count: 30,
        active: false,
      },
    },
  },
  {
    id: 4,
    title: "双鱼APP3.0UI/UX设计总结",
    description: "This is card 4",
    imageUrl: "https://images.dog.ceo/breeds/pembroke/n02113023_5006.jpg",
    badges: ["Badge 1", "Badge 2"],
    updatedAt: "2021-01-01",
    actions: {
      like: {
        count: 10,
        active: true,
      },
      star: {
        count: 20,
        active: false,
      },
      share: {
        count: 30,
        active: false,
      },
    },
  },
  {
    id: 5,
    title: "IP形象设计｜二狗APP IP设计升级 UI设计 表情包设计",
    description:
      "项目介绍丨PROJEC二狗APP-单身青年自救平台源自鹅厂的高学历实名制交友平台，专注于高学历单身青年的脱单平台。2019年对外开放注册以来，已有近千万优秀青年在此聚集，主要为互联网大厂员工、金融投行精英、体制内优秀单身青年等高学历群体，数十万人在此恋爱脱单，收获爱情。",
    imageUrl: "https://images.dog.ceo/breeds/pembroke/n02113023_4782.jpg",
    badges: ["Badge 1", "Badge 2"],
    updatedAt: "2021-01-01",
    actions: {
      like: {
        count: 10,
        active: false,
      },
      star: {
        count: 20,
        active: false,
      },
      share: {
        count: 30,
        active: false,
      },
    },
  },
  {
    id: 6,
    title: "趣鸟旅行 | 旅游APP | UI设计",
    description: "人生就是一场旅行，去看、去听、去感受",
    imageUrl: "https://images.dog.ceo/breeds/pembroke/n02113023_6735.jpg",
    badges: ["Badge 1", "Badge 2"],
    updatedAt: "2021-01-01",
    actions: {
      like: {
        count: 10,
        active: false,
      },
      star: {
        count: 20,
        active: false,
      },
      share: {
        count: 30,
        active: false,
      },
    },
  },
  {
    id: 7,
    title: "36篇系统UI界面设计",
    description:
      "本篇作品已经陆续发布较长时间，现将其中优秀的UI界面挑选发到站酷与大家分享，希望大家喜欢的同时别忘记点赞，别忘记关注哦",
    imageUrl: "https://images.dog.ceo/breeds/pembroke/n02113023_6383.jpg",
    badges: ["Badge 1", "Badge 2"],
    updatedAt: "2021-01-01",
    actions: {
      like: {
        count: 10,
        active: false,
      },
      star: {
        count: 20,
        active: true,
      },
      share: {
        count: 30,
        active: false,
      },
    },
  },
  {
    id: 8,
    title: "《Dream Car | 懂车的人，永远不会孤单》",
    description:
      "12岁的Jack总因为喜欢汽车被三个伙伴嘲笑。一次被欺负后，他独自走进爷爷尘封多年的停车间，意外发现一辆留给他的古老大众汽车。",
    imageUrl: "https://images.dog.ceo/breeds/pembroke/n02113023_4269.jpg",
    badges: ["Badge 1", "Badge 2"],
    updatedAt: "2021-01-01",
    actions: {
      like: {
        count: 10,
        active: false,
      },
      star: {
        count: 20,
        active: false,
      },
      share: {
        count: 30,
        active: false,
      },
    },
  },
  {
    id: 9,
    title: "《Dream Car | 懂车的人，永远不会孤单》",
    description:
      "12岁的Jack总因为喜欢汽车被三个伙伴嘲笑。一次被欺负后，他独自走进爷爷尘封多年的停车间，意外发现一辆留给他的古老大众汽车。",
    imageUrl: "https://images.dog.ceo/breeds/pembroke/n02113023_5032.jpg",
    badges: ["Badge 1", "Badge 2"],
    updatedAt: "2021-01-01",
    actions: {
      like: {
        count: 10,
        active: false,
      },
      star: {
        count: 20,
        active: false,
      },
      share: {
        count: 30,
        active: false,
      },
    },
  },
  {
    id: 10,
    title: "《Dream Car | 懂车的人，永远不会孤单》",
    description:
      "12岁的Jack总因为喜欢汽车被三个伙伴嘲笑。一次被欺负后，他独自走进爷爷尘封多年的停车间，意外发现一辆留给他的古老大众汽车。",
    imageUrl: "https://images.dog.ceo/breeds/pembroke/n02113023_5032.jpg",
    badges: ["Badge 1", "Badge 2"],
    updatedAt: "2021-01-01",
    actions: {
      like: {
        count: 10,
        active: false,
      },
      star: {
        count: 20,
        active: false,
      },
      share: {
        count: 30,
        active: false,
      },
    },
  },
  {
    id: 11,
    title: "大师联赛，踢出传奇 I 足球游戏矢量插画",
    description:
      "从1996年起，PES联合建队开始，他们长期征战于乙级联赛，玩家需要操控他们征战联赛，升级到甲级并夺取联赛冠军。大家所看到的，正是当年自己操纵摇杆指挥的这批经典球员，每名球员都耳熟能详，他们都有各自的特点，承载着很多玩家最初的青春回忆......",
    imageUrl: "https://images.dog.ceo/breeds/pembroke/n02113023_5032.jpg",
    badges: ["Badge 1", "Badge 2"],
    updatedAt: "2021-01-01",
    actions: {
      like: {
        count: 10,
        active: false,
      },
      star: {
        count: 20,
        active: false,
      },
      share: {
        count: 30,
        active: false,
      },
    },
  },
  {
    id: 20,
    title: "《Dream Car | 懂车的人，永远不会孤单》",
    description:
      "12岁的Jack总因为喜欢汽车被三个伙伴嘲笑。一次被欺负后，他独自走进爷爷尘封多年的停车间，意外发现一辆留给他的古老大众汽车。",
    imageUrl: "https://images.dog.ceo/breeds/pembroke/n02113023_5032.jpg",
    badges: ["Badge 1", "Badge 2"],
    updatedAt: "2021-01-01",
    actions: {
      like: {
        count: 10,
        active: false,
      },
      star: {
        count: 20,
        active: true,
      },
      share: {
        count: 30,
        active: false,
      },
    },
  },
  {
    id: 30,
    title: "潮流插画/矢量插画合集",
    description: "This is card 3",
    imageUrl: "https://images.dog.ceo/breeds/pembroke/n02113023_5032.jpg",
    badges: ["Badge 1", "Badge 2"],
    updatedAt: "2021-01-01",
    actions: {
      like: {
        count: 10,
        active: false,
      },
      star: {
        count: 20,
        active: false,
      },
      share: {
        count: 30,
        active: false,
      },
    },
  },
  {
    id: 40,
    title: "双鱼APP3.0UI/UX设计总结",
    description: "This is card 4",
    imageUrl: "https://images.dog.ceo/breeds/pembroke/n02113023_5032.jpg",
    badges: ["Badge 1", "Badge 2"],
    updatedAt: "2021-01-01",
    actions: {
      like: {
        count: 10,
        active: true,
      },
      star: {
        count: 20,
        active: false,
      },
      share: {
        count: 30,
        active: false,
      },
    },
  },
  {
    id: 50,
    title: "IP形象设计｜二狗APP IP设计升级 UI设计 表情包设计",
    description:
      "项目介绍丨PROJEC二狗APP-单身青年自救平台源自鹅厂的高学历实名制交友平台，专注于高学历单身青年的脱单平台。2019年对外开放注册以来，已有近千万优秀青年在此聚集，主要为互联网大厂员工、金融投行精英、体制内优秀单身青年等高学历群体，数十万人在此恋爱脱单，收获爱情。",
    imageUrl: "https://images.dog.ceo/breeds/pembroke/n02113023_5032.jpg",
    badges: ["Badge 1", "Badge 2"],
    updatedAt: "2021-01-01",
    actions: {
      like: {
        count: 10,
        active: false,
      },
      star: {
        count: 20,
        active: false,
      },
      share: {
        count: 30,
        active: false,
      },
    },
  },
  {
    id: 60,
    title: "趣鸟旅行 | 旅游APP | UI设计",
    description: "人生就是一场旅行，去看、去听、去感受",
    imageUrl: "https://images.dog.ceo/breeds/pembroke/n02113023_5032.jpg",
    badges: ["Badge 1", "Badge 2"],
    updatedAt: "2021-01-01",
    actions: {
      like: {
        count: 10,
        active: false,
      },
      star: {
        count: 20,
        active: false,
      },
      share: {
        count: 30,
        active: false,
      },
    },
  },
  {
    id: 70,
    title: "36篇系统UI界面设计",
    description:
      "本篇作品已经陆续发布较长时间，现将其中优秀的UI界面挑选发到站酷与大家分享，希望大家喜欢的同时别忘记点赞，别忘记关注哦",
    imageUrl: "https://images.dog.ceo/breeds/pembroke/n02113023_5032.jpg",
    badges: ["Badge 1", "Badge 2"],
    updatedAt: "2021-01-01",
    actions: {
      like: {
        count: 10,
        active: false,
      },
      star: {
        count: 20,
        active: true,
      },
      share: {
        count: 30,
        active: false,
      },
    },
  },
  {
    id: 80,
    title: "《Dream Car | 懂车的人，永远不会孤单》",
    description:
      "12岁的Jack总因为喜欢汽车被三个伙伴嘲笑。一次被欺负后，他独自走进爷爷尘封多年的停车间，意外发现一辆留给他的古老大众汽车。",
    imageUrl: "https://images.dog.ceo/breeds/pembroke/n02113023_5032.jpg",
    badges: ["Badge 1", "Badge 2"],
    updatedAt: "2021-01-01",
    actions: {
      like: {
        count: 10,
        active: false,
      },
      star: {
        count: 20,
        active: false,
      },
      share: {
        count: 30,
        active: false,
      },
    },
  },
  {
    id: 90,
    title: "《Dream Car | 懂车的人，永远不会孤单》",
    description:
      "12岁的Jack总因为喜欢汽车被三个伙伴嘲笑。一次被欺负后，他独自走进爷爷尘封多年的停车间，意外发现一辆留给他的古老大众汽车。",
    imageUrl: "https://images.dog.ceo/breeds/pembroke/n02113023_5032.jpg",
    badges: ["Badge 1", "Badge 2"],
    updatedAt: "2021-01-01",
    actions: {
      like: {
        count: 10,
        active: false,
      },
      star: {
        count: 20,
        active: false,
      },
      share: {
        count: 30,
        active: false,
      },
    },
  },
  {
    id: 100,
    title: "《Dream Car | 懂车的人，永远不会孤单》",
    description:
      "12岁的Jack总因为喜欢汽车被三个伙伴嘲笑。一次被欺负后，他独自走进爷爷尘封多年的停车间，意外发现一辆留给他的古老大众汽车。",
    imageUrl: "https://images.dog.ceo/breeds/pembroke/n02113023_5032.jpg",
    badges: ["Badge 1", "Badge 2"],
    updatedAt: "2021-01-01",
    actions: {
      like: {
        count: 10,
        active: false,
      },
      star: {
        count: 20,
        active: false,
      },
      share: {
        count: 30,
        active: false,
      },
    },
  },
];

const formSchema = z.object({
  leaveMessage: z.string().min(1, "请输入留言"),
  phone: z.string().min(1, "请输入手机号"),
  email: z.string().email("请输入正确的邮箱"),
});
type FormValues = z.infer<typeof formSchema>;
export default function Design() {
  const containerRef = useRef<HTMLDivElement>(null);
  const card = cards[1];
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  const onSubmit = async (data: FormValues) => {
    console.log("data", data);
  };
  return (
    <div
      ref={containerRef}
      className="pb-12 mb-4 relative w-full md:max-w-1/2 m-auto bg-white px-4 rounded-2xl shadow-2xl"
    >
      {/* 活动按钮 */}
      <div className="fixed right-8 bottom-32 flex flex-col space-y-2 bg-white rounded-full py-4 px-2 shadow-xl mt-2 border border-gray-200">
        <Button className="rounded-full w-12 h-16 flex flex-col justify-center items-center cursor-pointer hover:bg-amber-300 hover:drop-shadow-[0_4px_12px_#f59e0bcc]">
          <span>{card.actions.like.count}</span>
          <ThumbsUp
            size={46}
            fill={card.actions.like.active ? "#f59e0b" : "transparent"}
          />
        </Button>
        <Button className="rounded-full w-12 h-16 flex flex-col justify-center items-center cursor-pointer hover:bg-rose-300 hover:drop-shadow-[0_4px_12px_#f43f5ecc]">
          <span>{card.actions.star.count}</span>
          <Star
            size={46}
            fill={card.actions.star.active ? "#f43f5e" : "transparent"}
          />
        </Button>
        <Button className="rounded-full w-12 h-16 flex flex-col justify-center items-center cursor-pointer hover:bg-teal-400 hover:drop-shadow-[0_4px_12px_#14b8a6cc]">
          <span>{card.actions.share.count}</span>
          <Share2
            size={46}
            fill={card.actions.share.active ? "#14b8a6" : "transparent"}
          />
        </Button>
      </div>
      <section>
        <div>
          <div>
            <h1 className="text-4xl font-bold mb-6">{card.title}</h1>
            <div vocab="https://schema.org" className="flex space-x-2 mb-4">
              {card.badges.map((badge) => (
                <Badge key={badge} variant="outline" className="opacity-50">
                  {badge}
                </Badge>
              ))}
            </div>
            <p className="border-t-gray-200 text-gray-500 text-sm">
              更新时间：{card.updatedAt}
            </p>
            <section className="flex space-x-2 my-4">
              <p className="">{card.description}</p>
            </section>
          </div>
        </div>
        <Image
          width={200}
          height={300}
          loading="eager"
          src={card.imageUrl}
          alt="Event cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // 加载优化
          className="relative z-20 w-full h-auto object-cover object-top rounded-2xl select-none [-webkit-user-drag:none]"
        />
      </section>
      <section className="mt-12">
        <h2 className="text-2xl font-bold my-6 flex items-center gap-2">
          <PencilRuler size={24} />
          推荐相关 · <span className="text-teal-400">设计作品</span>
        </h2>
        <ScrollArea className="w-full">
          <div className="flex flex-row gap-4">
            {cards.slice(0, 5).map((card) => (
              <figure key={card.id} className="h-full w-60 shrink-0">
                <div className="relative">
                  <Image
                    width={200}
                    height={300}
                    loading="eager"
                    src={card.imageUrl}
                    alt="Event cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // 加载优化
                    className="relative z-20 rounded-2xl aspect-4/3 h-fit w-full object-cover object-top select-none [-webkit-user-drag:none]"
                  />
                  <p className="absolute top-2 left-2 z-20 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm text-white flex gap-1 items-center cursor-pointer">
                    <ThumbsUp
                      size={16}
                      fill={
                        card.actions.like.active ? "#f59e0b" : "transparent"
                      }
                    />
                    {card.actions.like.count}
                  </p>
                </div>

                <figcaption className="w-full pt-2 flex justify-between items-center gap-2">
                  <span className="line-clamp-1 text-md font-bold">
                    {card.description}
                  </span>
                  <span className="text-sm text-gray-400 flex items-center gap-1 shrink-0">
                    <Eye size={16} />
                    {card.actions.like.count}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>
      <section className="mt-12">
        <h2 className="text-2xl font-bold my-6 flex items-center gap-2">
          <MessageSquareText size={24} />
          留下足迹 ·{" "}
          <span className="text-teal-400">在此给作者写下您的留言</span>
        </h2>
        <form method="post" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="rounded-2xl p-6 border-6 border-gray-300 bg-gray-100 overflow-hidden">
              <textarea
                maxLength={500}
                {...register("leaveMessage")}
                className="w-full h-40 min-h-40 max-h-80 outline-none focus:outline-none"
                placeholder="在此给作者写下您的留言"
              ></textarea>
            </div>
            <span
              className={cn("text-red-500 text-sm h-4 w-full inline-block", {
                invisible: !errors.leaveMessage,
              })}
            >
              {errors.leaveMessage && errors.leaveMessage.message}
            </span>
          </div>
          <div>
            <div className="flex flex-row gap-4 mt-2">
              <div className="flex-1">
                <Input
                  {...register("phone")}
                  type="phone"
                  placeholder="请输入您的手机号"
                  className="flex-1 block w-full h-max rounded-2xl p-4 border-6 border-gray-300 bg-gray-100 outline-none focus:outline-none"
                />
                <span
                  className={cn(
                    "text-red-500 text-sm shrink-0 h-4 w-full inline-block",
                    {
                      invisible: !errors.phone,
                    }
                  )}
                >
                  {errors.phone && errors.phone.message}
                </span>
              </div>
              <div className="flex-1">
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="请输入您的邮箱"
                  className="flex-1 block w-full h-fit rounded-2xl p-4 border-6 border-gray-300 bg-gray-100 outline-none focus:outline-none"
                />
                <span
                  className={cn(
                    "text-red-500 text-sm shrink-0 h-4 w-full inline-block",
                    {
                      invisible: !errors.email,
                    }
                  )}
                >
                  {errors.email && errors.email.message}
                </span>
              </div>
            </div>
            <div className="flex flex-row gap-4 mt-6">
              <Button
                type="submit"
                className="w-60 h-14 rounded-2xl px-4 py-2 bg-gray-300 text-2xl font-bold mt-4 cursor-pointer"
              >
                取消留言
              </Button>
              <Button
                type="submit"
                className="flex-1 h-14 rounded-2xl px-4 py-2 bg-teal-300 text-2xl font-bold mt-4 cursor-pointer"
              >
                提交
              </Button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
