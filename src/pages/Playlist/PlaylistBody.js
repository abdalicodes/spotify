import React from "react";
import { useParams } from "react-router-dom";
import { usePlaylist } from "hooks/playlist";
import Box from "@mui/material/Box";
import PlaylistLayout from "pages/PlaylistLayout";
import gradient from "util/gradient";
import PlaylistActionBar from "components/organisms/PlaylistActionBar";
import PlaylistHeader from "components/organisms/PlaylistHeader";
import SongLibrary from "components/molecules/SongLibrary";
import { useSearchState } from "context/SearchContext";
import { usePlayerState } from "context/PlayerContext";
import CircularProgress from "@mui/material/CircularProgress";
function PlaylistBody() {
  const { id } = useParams();
  const { data, isLoading } = usePlaylist(id);
  const [list, setList] = React.useState([]);
  const { searchQuery } = useSearchState();
  const { playlist, playingMusic, play } = usePlayerState();
  React.useEffect(() => {
    if (!isLoading) {
      setList(data.musics);
    }
  }, [data]);
  React.useEffect(() => {
    if (!isLoading) {
      const filtered = data.musics.filter((i) => {
        const regex = new RegExp(searchQuery, "i");
        const search = i.title.search(regex);
        if (search < 0) return false;
        else return true;
      });
      setList(filtered);
    }
  }, [searchQuery]);
  const renderList = React.useCallback(
    () =>
      list.map((item, i) => {
        return (
          <SongLibrary
            key={i}
            item={item}
            index={i}
            playingMusic={playingMusic}
            play={play}
            playlist={data}
          />
        );
      }),
    [list, playlist, playingMusic, play]
  );

  if (isLoading || list.length < 1)
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <CircularProgress color="success" thickness={5} />
      </Box>
    );
  return (
    <PlaylistLayout>
      <PlaylistHeader
        backgroundColor={gradient.blue1}
        cover={data.cover}
        title={data.title}
        description={data.description}
      />
      <Box sx={{ marginTop: "22px" }}>
        <PlaylistActionBar data={data} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "0 48px",
            alignItems: "center",
            marginTop: "50px",
            "& > * ~ *": {
              marginTop: "16px",
            },
          }}
        >
          {renderList()}
        </Box>
      </Box>
    </PlaylistLayout>
  );
}

export default PlaylistBody;
