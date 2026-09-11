"use client";
import { debounce } from "@/app/utils/tools";
import { DesignCard } from "@/components/design/DesignCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
const debounceFn = debounce((fn) => {
  if (typeof fn !== "function") return;
  // 在此处做你的搜索逻辑
  fn("9999999");
}, 500);
export default function Design() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleIndexes, setVisibleIndexes] = useState(new Set());
  const [visibleCount, setVisibleCount] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const cardHeightsRef = useRef<Map<number, number>>(new Map());
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [positions, setPositions] = useState<
    Map<number, { left: number; top: number; width: number; height: number }>
  >(new Map());
  useEffect(() => {
    // 右键拦截
    // const onContext = (e: MouseEvent) => e.preventDefault();
    // document.addEventListener("contextmenu", onContext);

    // 快捷键拦截
    // const onKey = (e: KeyboardEvent) => {
    //   if (e.key === "F12") e.preventDefault();
    //   if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "i")
    //     e.preventDefault();
    //   if ((e.metaKey || e.ctrlKey) && e.key === "s") e.preventDefault();
    // };
    // document.addEventListener("keydown", onKey);
    let observers: IntersectionObserver[] = [];
    let observer: IntersectionObserver;
    const timer = setTimeout(() => {
      // 分别监听每张卡片
      observers = cardRefs.current.map((card, index) => {
        observer = new IntersectionObserver(
          (entries) => {
            const count = entries.filter(
              (entry) => entry.isIntersecting
            ).length; // 剩余的卡片露出来了
            if (entries[0].isIntersecting) {
              // 这张卡片露出来了，加入 Set
              setVisibleIndexes((prev) => new Set(prev).add(index));
              setShouldAnimate(true);
              observer.disconnect(); // 只触发一次
            }
            setVisibleCount(count);
          },
          // ([entry]) => {
          //   if (entry.isIntersecting) {
          //     // 这张卡片露出来了，加入 Set
          //     setVisibleIndexes((prev) => new Set(prev).add(index));
          //     observer.disconnect(); // 只触发一次
          //   }
          // },
          { threshold: 0.15 } // 露出 15% 就触发
        );

        if (card) observer.observe(card); // 如果有卡片，就观察
        return observer;
      }, 200);
    });

    // 清理所有 observer
    return () => {
      observers.forEach((obs) => obs.disconnect());
      clearTimeout(timer);
      observer?.disconnect();
      // document.removeEventListener("contextmenu", onContext);
      // document.removeEventListener("keydown", onKey);
    };
  }, []);
  const doDebounce = useCallback(
    (value: string) =>
      debounceFn((val) => {
        console.log("value", value, "val", val);
        // setSearchValue(val);
      }),
    []
  );
  // 列数配置
  const getColumnCount = useCallback(() => {
    const width = window.innerWidth;
    if (width < 1000) return 2;
    if (width < 1300) return 3;
    return 4;
  }, []);
  // 计算布局
  const calcLayout = useCallback(() => {
    // 用测量到的高度计算布局
    const columnCount = getColumnCount();
    const columnHeights = new Array(columnCount).fill(0);
    const gap = 16;
    const containerWidth = containerRef.current
      ? containerRef.current?.offsetWidth
      : 0;
    const columnWidth =
      (containerWidth - gap * (columnCount - 1)) / columnCount;
    const newPositions: Map<
      number,
      { left: number; top: number; width: number; height: number }
    > = new Map();

    cards.forEach((card) => {
      const height = cardHeightsRef.current.get(card.id) || 200;
      const shortestCol = columnHeights.indexOf(Math.min(...columnHeights));
      const left = shortestCol * (columnWidth + gap);
      const top = columnHeights[shortestCol];
      newPositions.set(card.id, { left, top, width: columnWidth, height });
      columnHeights[shortestCol] += height + gap + 16;
    });

    const timer = setTimeout(() => {
      // setPositions(newPositions);
      setPositions(
        (
          prev: Map<
            number,
            { left: number; top: number; width: number; height: number }
          >
        ) => {
          return new Map([...prev, ...newPositions]);
        }
      );
      setContainerHeight(Math.max(...columnHeights));
    });
    return () => clearTimeout(timer);
  }, [cardHeightsRef, getColumnCount]);

  return (
    <div onClick={() => setShowSearch(false)}>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">设计作品 {20}个</h1>
        <div className="relative">
          <div className="relative">
            <Input
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                const vv = doDebounce(e.target.value);
                console.log("vv", vv);
              }}
              onClick={(e) => {
                e.stopPropagation();
                setShowSearch((pre) => !pre);
                console.log("showSearch", showSearch);
              }}
              placeholder="搜索"
              className="w-full xl:w-120  p-4 rounded-2xl min-h-10"
            />
            <Button className="absolute right-2 top-1/2 -translate-y-1/2">
              <Search />
              搜索
              <Kbd className="ml-1 bg-gray-200 rounded">⌘K</Kbd>
            </Button>
          </div>
          {showSearch && (
            <div
              className="absolute mt-3 w-full bg-white/20 backdrop-blur-md p-4 rounded-2xl min-h-10 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>作品主推</h3>
              <ul className="mt-2 flex flex-row flex-wrap gap-2">
                <li
                  className="px-2 bg-gray-100/80 rounded-2xl cursor-pointer"
                  onClick={() => {
                    setSearchValue("UI设计");
                    setShowSearch(false);
                  }}
                >
                  UI设计
                </li>
                <li
                  className="px-2 bg-gray-100/80 rounded-2xl cursor-pointer"
                  onClick={() => {
                    setSearchValue("图标设计");
                    setShowSearch(false);
                  }}
                >
                  图标设计
                </li>
                <li
                  className="px-2 bg-gray-100/80 rounded-2xl cursor-pointer"
                  onClick={() => {
                    setSearchValue("图标设计");
                    setShowSearch(false);
                  }}
                >
                  LOGO设计
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <div
        ref={containerRef}
        className="pb-12 mb-4 relative"
        style={{ height: containerHeight || "2000px" }}
      >
        <div
        // className={cn(
        //   "flex w-full gap-4 opacity-0 transform translate-y-40 duration-200 ease-bezier[0.22,1,0,0.36,1] delay-0",
        //   visibleIndexes.has(index) && "opacity-100 translate-y-0 delay-0"
        // )}
        >
          {cards.map((card, index) => {
            const pos = positions.get(card.id);
            return (
              <div
                key={index}
                ref={(card) => {
                  cardRefs.current[index] = card as HTMLDivElement;
                }}
                className={cn(
                  "w-[calc(33%-1.5rem)] h-fit rounded-2xl opacity-0 translate-y-40 transform  duration-600 ease-bezier[0.22,1,0,0.36,1] delay-0",
                  visibleIndexes.has(index) &&
                    "opacity-100 translate-y-0 delay-0"
                  // shouldAnimate ? "opacity-100 translate-y-0" : ""
                )}
                onClick={() => {
                  console.log(cardHeightsRef.current, 1);
                }}
                // style={{
                //   position: "absolute",
                //   top: pos?.top + "px",
                //   left: pos?.left + "px",
                //   width: pos?.width + "px",
                //   height: pos?.height + "px",
                // }}
                // 解决在卡片延迟滑出时，下面的卡片延迟时间不协调的问题
                style={
                  {
                    position: "absolute",
                    // top: pos?.top + "px",
                    top:
                      (pos?.top === undefined ? index * 450 : pos?.top) + "px",
                    left: pos?.left + "px",
                    width: (pos?.width || 450) + "px",
                    height: (pos?.height || 600) + "px",
                    transitionDelay: `${200}ms`,
                  } as React.CSSProperties
                }
              >
                <DesignCard
                  data={card}
                  cardHeightsRef={cardHeightsRef}
                  calcLayout={calcLayout}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
