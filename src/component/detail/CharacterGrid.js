import { useEffect, useState } from "react";

export default function CharacterGrid({ charactersData }) {
  const [characters, setCharacters] = useState(charactersData || []);
  useEffect(() => {
    setCharacters(charactersData);
  }, [charactersData]);

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {characters?.map((character, index) => (
          <div key={index} className="group h-[200px] w-[160px] [perspective:1000px]">
            <div className="relative h-full w-full rounded-lg transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
              {/* Front of Card */}
              <div className="absolute inset-0 rounded-lg overflow-hidden">
                <img
                  src={character?.reference_image}
                  alt={character.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-0 left-0 p-4 flex items-center justify-between w-full">
                  <div className="text-white text-2xl font-bold">{character.name}</div>
                  <div className="bg-black/70 text-white px-3 py-1 rounded-md text-sm">
                    {character.role}
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div
                style={{ background: "linear-gradient(180deg, #A0F9FF 0%, #A9A0FF 100%)" }}
                className="absolute text-black inset-0 h-full w-full rounded-lg px-4 py-4 [transform:rotateY(180deg)] [backface-visibility:hidden]"
              >
                <div className="flex flex-col h-full">
                  <div className="text-2xl font-bold mb-2">{character.name}</div>
                  <div className="bg-black/70 text-black px-3 py-1 rounded-md text-sm w-fit mb-4">
                    {character.role}
                  </div>
                  <div className="text-sm">
                    <p className="mb-2">{character.token}</p>
                    <p>{character.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
