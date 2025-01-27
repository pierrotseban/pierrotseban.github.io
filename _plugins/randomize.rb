module Jekyll
  module RandomFilter
    def randomize(input)
      input.shuffle
    end
  end
end

Liquid::Template.register_filter(Jekyll::RandomFilter)