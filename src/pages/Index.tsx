import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Anime {
  id: number;
  title: string;
  titleRu: string;
  image: string;
  rating: number;
  year: number;
  episodes: number;
  genre: string[];
  status: string;
  description: string;
}

const mockAnime: Anime[] = [
  {
    id: 1,
    title: 'Demon Slayer: Infinity Castle',
    titleRu: 'Клинок, рассекающий демонов: Замок бесконечности',
    image: 'https://cdn.poehali.dev/projects/f776f285-da3f-4696-9e2b-0acaf17f714a/files/016ea03e-a55e-4b9a-8818-692ab1720999.jpg',
    rating: 9.2,
    year: 2025,
    episodes: 24,
    genre: ['Экшен', 'Фэнтези', 'Сёнэн'],
    status: 'Онгоинг',
    description: 'Продолжение легендарной истории о Танджиро и его друзьях в финальной арке'
  },
  {
    id: 2,
    title: 'Jujutsu Kaisen Season 3',
    titleRu: 'Магическая битва 3',
    image: 'https://cdn.poehali.dev/projects/f776f285-da3f-4696-9e2b-0acaf17f714a/files/647f0f01-ca51-4d9e-a091-1ae734d341fc.jpg',
    rating: 9.0,
    year: 2025,
    episodes: 12,
    genre: ['Экшен', 'Сёнэн', 'Сверхъестественное'],
    status: 'Онгоинг',
    description: 'Юдзи и его товарищи продолжают борьбу с проклятиями'
  },
  {
    id: 3,
    title: 'Cyberpunk Chronicles',
    titleRu: 'Киберпанк: Хроники',
    image: 'https://cdn.poehali.dev/projects/f776f285-da3f-4696-9e2b-0acaf17f714a/files/3945599c-4815-488d-8c09-9e5183f1e29a.jpg',
    rating: 8.8,
    year: 2025,
    episodes: 13,
    genre: ['Фантастика', 'Экшен', 'Киберпанк'],
    status: 'Завершён',
    description: 'Футуристическая история о хакере в неоновом городе будущего'
  },
  {
    id: 4,
    title: 'My Hero Academia Season 7',
    titleRu: 'Моя геройская академия 7',
    image: 'https://cdn.poehali.dev/projects/f776f285-da3f-4696-9e2b-0acaf17f714a/files/016ea03e-a55e-4b9a-8818-692ab1720999.jpg',
    rating: 8.7,
    year: 2025,
    episodes: 25,
    genre: ['Экшен', 'Сёнэн', 'Супергерои'],
    status: 'Онгоинг',
    description: 'Деку и класс 1-A сталкиваются с новыми угрозами'
  },
  {
    id: 5,
    title: 'Sword Art Online: Unital Ring',
    titleRu: 'Мастера меча онлайн: Унитал Ринг',
    image: 'https://cdn.poehali.dev/projects/f776f285-da3f-4696-9e2b-0acaf17f714a/files/647f0f01-ca51-4d9e-a091-1ae734d341fc.jpg',
    rating: 8.5,
    year: 2025,
    episodes: 24,
    genre: ['Фэнтези', 'Экшен', 'Романтика'],
    status: 'Онгоинг',
    description: 'Кирито и Асуна исследуют новый загадочный мир виртуальной реальности'
  },
  {
    id: 6,
    title: 'One Piece: Elbaf Arc',
    titleRu: 'Ван-Пис: Арка Эльбаф',
    image: 'https://cdn.poehali.dev/projects/f776f285-da3f-4696-9e2b-0acaf17f714a/files/3945599c-4815-488d-8c09-9e5183f1e29a.jpg',
    rating: 9.1,
    year: 2025,
    episodes: 50,
    genre: ['Приключения', 'Экшен', 'Комедия'],
    status: 'Онгоинг',
    description: 'Луффи и его команда достигают легендарного острова гигантов'
  }
];

const genres = ['Все жанры', 'Экшен', 'Фэнтези', 'Сёнэн', 'Сверхъестественное', 'Фантастика', 'Киберпанк', 'Супергерои', 'Романтика', 'Приключения', 'Комедия'];

function Index() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState('Все жанры');
  const [searchQuery, setSearchQuery] = useState('');
  const [myList, setMyList] = useState<number[]>([]);

  const filteredAnime = mockAnime.filter(anime => {
    const matchesSearch = anime.titleRu.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          anime.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'Все жанры' || anime.genre.includes(selectedGenre);
    const matchesTab = activeTab === 'all' || 
                       (activeTab === 'new' && anime.year === 2025) ||
                       (activeTab === 'top' && anime.rating >= 9.0) ||
                       (activeTab === 'mylist' && myList.includes(anime.id));
    return matchesSearch && matchesGenre && matchesTab;
  });

  const toggleMyList = (id: number) => {
    setMyList(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-heading font-bold text-gradient">AnimeHub</h1>
            <div className="hidden md:flex items-center gap-6">
              <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
                <Icon name="Home" size={18} className="mr-2" />
                Главная
              </Button>
              <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
                <Icon name="Grid3x3" size={18} className="mr-2" />
                Каталог
              </Button>
              <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
                <Icon name="TrendingUp" size={18} className="mr-2" />
                Топ
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Поиск аниме..." 
                className="pl-10 w-64 bg-muted/50 border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="ghost" size="icon">
              <Icon name="User" size={20} />
            </Button>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        <section className="relative h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="https://cdn.poehali.dev/projects/f776f285-da3f-4696-9e2b-0acaf17f714a/files/016ea03e-a55e-4b9a-8818-692ab1720999.jpg"
              alt="Hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
          </div>
          
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl animate-fade-in">
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                <Icon name="Star" size={14} className="mr-1" />
                Хит сезона 2025
              </Badge>
              <h2 className="text-5xl md:text-7xl font-heading font-bold mb-4 leading-tight">
                Demon Slayer:<br />
                <span className="text-gradient">Infinity Castle</span>
              </h2>
              <p className="text-lg text-foreground/80 mb-6 max-w-xl">
                Финальная арка легендарной истории. Танджиро и его друзья вступают в решающую битву в бесконечном замке демонов.
              </p>
              <div className="flex items-center gap-4 mb-6">
                <Badge variant="outline" className="text-sm">
                  <Icon name="Calendar" size={14} className="mr-1" />
                  2025
                </Badge>
                <Badge variant="outline" className="text-sm">
                  <Icon name="Film" size={14} className="mr-1" />
                  24 эпизода
                </Badge>
                <Badge variant="outline" className="text-sm">
                  <Icon name="Star" size={14} className="mr-1" />
                  9.2
                </Badge>
              </div>
              <div className="flex gap-3">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Icon name="Play" size={20} className="mr-2" />
                  Смотреть
                </Button>
                <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/10">
                  <Icon name="Plus" size={20} className="mr-2" />
                  В список
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="bg-muted/50 p-1">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Все аниме
                </TabsTrigger>
                <TabsTrigger value="new" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Icon name="Sparkles" size={16} className="mr-2" />
                  Новинки 2025
                </TabsTrigger>
                <TabsTrigger value="top" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Icon name="Trophy" size={16} className="mr-2" />
                  Топ
                </TabsTrigger>
                <TabsTrigger value="mylist" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Icon name="Heart" size={16} className="mr-2" />
                  Мой список ({myList.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-full md:w-[200px] bg-muted/50 border-border">
                  <SelectValue placeholder="Жанр" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map(genre => (
                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="md:hidden relative flex-1">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Поиск..." 
                  className="pl-10 bg-muted/50 border-border"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnime.map((anime, index) => (
              <Card 
                key={anime.id} 
                className="group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] animate-fade-in cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img 
                    src={anime.image} 
                    alt={anime.titleRu}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Badge className="bg-primary/90 backdrop-blur-sm">
                      <Icon name="Star" size={12} className="mr-1" />
                      {anime.rating}
                    </Badge>
                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    className={`absolute top-3 left-3 backdrop-blur-sm ${
                      myList.includes(anime.id) 
                        ? 'bg-primary/90 hover:bg-primary text-primary-foreground' 
                        : 'bg-black/50 hover:bg-black/70'
                    }`}
                    onClick={() => toggleMyList(anime.id)}
                  >
                    <Icon name={myList.includes(anime.id) ? "Heart" : "Plus"} size={18} />
                  </Button>

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-heading font-semibold text-white text-lg mb-1 line-clamp-1">
                      {anime.titleRu}
                    </h3>
                    <p className="text-white/70 text-sm mb-2 line-clamp-1">{anime.title}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {anime.genre.slice(0, 2).map(g => (
                        <Badge key={g} variant="secondary" className="text-xs bg-white/10 backdrop-blur-sm text-white border-0">
                          {g}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/60">
                      <span className="flex items-center">
                        <Icon name="Calendar" size={12} className="mr-1" />
                        {anime.year}
                      </span>
                      <span className="flex items-center">
                        <Icon name="Film" size={12} className="mr-1" />
                        {anime.episodes} эп.
                      </span>
                      <Badge className="text-xs bg-secondary/80 text-secondary-foreground">
                        {anime.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg">
                    <Icon name="Play" size={20} className="mr-2" />
                    Смотреть
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredAnime.length === 0 && (
            <div className="text-center py-20">
              <Icon name="Search" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-2xl font-heading font-semibold mb-2">Ничего не найдено</h3>
              <p className="text-muted-foreground">Попробуйте изменить фильтры или поисковый запрос</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Index;
